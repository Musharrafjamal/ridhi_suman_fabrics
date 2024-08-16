import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

import dbConnect from "@/config/db";

import User from "@/model/user";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret });

    if (!token) {
      return NextResponse.json("Unauthorized Request", { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(token._id)
      .select("-password -otp -updatedAt")
      .exec();

    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const token = await getToken({ req: request, secret });

    if (!token) {
      return NextResponse.json("Unauthorized Request", { status: 401 });
    }

    await dbConnect();

    const data = await request.json();

    if (!data) {
      return NextResponse.json("Invalid data", { status: 400 });
    }

    if (
      data.password ||
      data.email ||
      data.phone ||
      data.role ||
      data.otp ||
      data.verified
    ) {
      return NextResponse.json(
        {
          error: "You can't update password, email, phone, role, otp, verified",
        },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(token._id, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error(err);

    return NextResponse.json(err.message, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await dbConnect();

    const result = await User.deleteMany({});

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "No users found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "All users deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server Error" },
      { status: 500 }
    );
  }
}
