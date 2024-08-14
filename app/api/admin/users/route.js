import { NextResponse } from "next/server";

import dbConnect from "@/config/db";

import User from "@/model/user";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;

    const skip = (page - 1) * limit;

    await dbConnect();

    const users = await User.find({ createdBy: "user" })
      .skip(skip)
      .limit(limit)
      .select("-password -otp -updatedAt -shippingInfo -cart -wishlist")
      .exec();
    const totalUsers = await User.countDocuments({ createdBy: "user" });
    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json(
      {
        data: users,
        meta: {
          totalUsers,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
