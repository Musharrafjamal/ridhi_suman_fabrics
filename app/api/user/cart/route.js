import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import User from "@/model/user";
import Product from "@/model/product";

import dbConnect from "@/config/db";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return NextResponse.json(
        {
          data: [],

          totalQuantity: 0,
          totalAmount: 0,
        },
        { status: 200 }
      );
    }

    await dbConnect();

    const user = await User.findById(token._id).populate("cart.product");

    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    let totalQuantity = 0;
    let totalAmount = 0;

    const cart = user.cart.map((item) => {
      totalAmount =
        totalAmount +
        (item.product.price -
          (item.product.discount * item.product.price) / 100) *
          item.quantity;

      totalQuantity = totalQuantity + item.quantity;

      return {
        _id: item.product._id,
        title: item.product.title,
        images: item.product.images[0],
        price: item.product.price,
        discount: item.product.discount,
        quantity: item.quantity,
        color: item.color || {
          name: null,
          hex: null,
        },
        size: item.size,
      };
    });

    return NextResponse.json(
      { data: cart, totalQuantity, totalAmount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cart:", error);

    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return NextResponse.json("Login to add product in cart.", {
        status: 401,
      });
    }

    const {
      productId,
      quantity = 1,
      color = null,
      size = null,
    } = await req.json();

    if (!productId || !quantity) {
      return NextResponse.json("Invalid product data", { status: 400 });
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

    const productIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex > -1) {
      if (color && size) {
        console.log("color and size", color, size);
        if (!color.name || !color.hex || !size) {
          return NextResponse.json("Color and size must be defined", {
            status: 400,
          });
        }

        user.cart[productIndex].quantity += quantity;
        user.cart[productIndex].color = color;
        user.cart[productIndex].size = size;
      } else {
        user.cart[productIndex].quantity += quantity;
      }
    } else {
      user.cart.push({
        product: productId,
        quantity,
        color: {
          name: color && color.name,
          hex: color && color.hex,
        },
        size,
      });
    }

    await user.save();

    await user.populate("cart.product");

    const cart = user.cart.map((item) => {
      return {
        _id: item.product._id,
        title: item.product.title,
        images: item.product.images[0],
        price: item.product.price,
        discount: item.product.discount,
        category: item.product.category,
        subCategory: item.product.subCategory,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      };
    });

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("Error updating cart:", error);

    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return NextResponse.json("Unauthorized Request", { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json("Invalid product data", { status: 400 });
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

    const productIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex > -1) {
      user.cart.splice(productIndex, 1);
      await user.save();

      return NextResponse.json("Product removed from cart.", { status: 200 });
    } else {
      return NextResponse.json("Product not in cart", { status: 404 });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);

    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
