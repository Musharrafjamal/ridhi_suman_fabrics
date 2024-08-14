import { NextResponse } from "next/server";

import Order from "@/model/order";

import dbConnect from "@/config/db";
import { checkAuthorization } from "@/config/checkAuthorization";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    // const isAdmin = await checkAuthorization(request);

    // if (isAdmin === "Unauthorized" || !isAdmin) {
    //   return NextResponse.json("Unauthorized Request", { status: 401 });
    // }

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;

    const skip = (page - 1) * limit;

    await dbConnect();

    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .select(
        "-cartItems -shippingInfo -paymentMethod -canceledBy -cancellationReason -isPaid -shiprocketOrderId -shiprocketShipmentId -transactionId"
      )
      .populate({
        path: "user",
        select: "name image phoneNumber",
      })
      .exec();

    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json(
      {
        data: orders,
        pagination: {
          totalOrders,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.log({ Error: err });
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
