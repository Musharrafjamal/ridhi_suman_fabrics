import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import User from "@/model/user";
import Product from "@/model/product";

import dbConnect from "@/config/db";

import mongoose from "mongoose";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return NextResponse.json(
        {
          data: [],
        },
        { status: 200 }
      );
    }

    await dbConnect();

    const user = await User.findById(token._id, {
      wishlist: { $slice: 12 },
    });

    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    return NextResponse.json(
      {
        data: user.wishlist,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return NextResponse.json([], { status: 401 });
    }

    const { productId, action } = await req.json();

    if (!productId || !action) {
      return NextResponse.json("Invalid request data", { status: 400 });
    }

    if (action !== "add" && action !== "remove") {
      return NextResponse.json("Invalid action", { status: 400 });
    }

    await dbConnect();

    const productExists = await Product.findById(productId);

    if (!productExists) {
      return NextResponse.json("Product not found", { status: 404 });
    }

    const user = await User.findById(token._id);

    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);

    if (action === "add") {
      if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productObjectId);
      }
    } else if (action === "remove") {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    }

    await user.save();

    return NextResponse.json(user.wishlist, { status: 200 });
  } catch (error) {
    console.error("Error updating wishlist:", error);

    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
