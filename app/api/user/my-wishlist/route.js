import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import User from "@/model/user";

import dbConnect from "@/config/db";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return NextResponse.json(
        {
          data: [],
          meta: { page: 1, size: 12, totalPages: 0, totalItems: 0 },
        },
        { status: 200 }
      );
    }

    const searchParams = new URL(req.url).searchParams;

    const page = parseInt(searchParams.get("page")) || 1;
    const size = parseInt(searchParams.get("size")) || 12;

    const skip = (page - 1) * size;

    await dbConnect();

    const user = await User.findById(token._id).populate({
      path: "wishlist",
      select: "category subCategory title images price discount sizes",
      populate: {
        path: "images",
        options: { limit: 1 },
      },
    });

    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    const wishlist = user.wishlist.slice(skip, skip + size);

    const totalItems = user.wishlist.length;
    const totalPages = Math.ceil(totalItems / size);

    return NextResponse.json(
      {
        data: wishlist,
        meta: {
          page,
          size,
          totalPages,
          totalItems,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
