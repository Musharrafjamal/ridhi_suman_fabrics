import { NextResponse } from "next/server";

import dbConnect from "@/config/db";

import Product from "@/model/product";

import { checkAuthorization } from "@/config/checkAuthorization";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    let isAdmin = await checkAuthorization(request);

    if (isAdmin === "Unauthorized") {
      isAdmin = false;
    }

    const searchParams = request.nextUrl.searchParams;

    const page = searchParams.get("page") || 1;
    const pageSize = searchParams.get("size") || 10;

    const category = searchParams.get("category") || "all";
    const subCategory = searchParams.get("subCategory") || "all";

    const skip = (page - 1) * pageSize;

    await dbConnect();

    let products, totalProducts;

    if (isAdmin) {
      let query = Product.find().select("-description").sort({ orders: -1 });

      if (category !== "all") {
        query = query.where("category").equals(category);

        if (subCategory !== "all") {
          query = query.where("subCategory.name").equals(subCategory);
        }
      }

      products = await query.skip(parseInt(skip)).limit(parseInt(pageSize));

      totalProducts = await Product.countDocuments(query.getQuery());
    } else {
      products = await Product.find({ visibility: true })
        .select("-description -visibility -orders -updatedAt -createdAt")
        .skip(parseInt(skip))
        .limit(parseInt(pageSize));

      totalProducts = await Product.countDocuments({ visibility: true });
    }

    return NextResponse.json(
      {
        data: products,
        meta: {
          page: page,
          pageSize: pageSize,
          totalPages: Math.ceil(totalProducts / pageSize),
          totalResults: totalProducts,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(`Error fetching products: ${error.message}`, {
      status: 500,
    });
  }
}
