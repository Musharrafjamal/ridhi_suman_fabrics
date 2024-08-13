import { NextResponse } from "next/server";

import User from "@/model/user";
import Order from "@/model/order";
import Product from "@/model/product";
import Category from "@/model/category";
import SetOfProduct from "@/model/setOfProduct";

import dbConnect from "@/config/db";
import { checkAuthorization } from "@/config/checkAuthorization";

export async function GET(request) {
  try {
    const isAdmin = await checkAuthorization(request);

    if (isAdmin === "Unauthorized" || !isAdmin) {
      return NextResponse.json("Unauthorized Request", { status: 401 });
    }

    await dbConnect();

    const [
      categoriesCount,
      subCategoriesCount,
      usersCount,
      productsCount,
      setOfProductsCount,
      deliveredOrdersCount,
      ongoingOrdersCount,
      canceledOrdersCount,
    ] = await Promise.all([
      Category.countDocuments(),
      Category.aggregate([
        { $unwind: "$subCategories" }, // Unwind subCategories array
        { $group: { _id: null, count: { $sum: 1 } } }, // Group and sum the subCategories
      ]).then((result) => result[0]?.count || 0), // Get the count or default to 0

      User.countDocuments(),

      Product.countDocuments(),
      SetOfProduct.countDocuments(),

      Order.countDocuments({ status: "delivered" }),
      Order.countDocuments({
        status: { $in: ["confirmed"] },
      }),
      Order.countDocuments({ status: "canceled" }),
    ]);

    return NextResponse.json(
      {
        categoriesCount,
        subCategoriesCount,

        usersCount,

        productsCount,
        setOfProductsCount,

        deliveredOrdersCount,
        ongoingOrdersCount,
        canceledOrdersCount,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
