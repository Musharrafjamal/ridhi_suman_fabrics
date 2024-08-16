import crypto from "crypto";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import dbConnect from "@/config/db";

import User from "@/model/user";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json("User ID is required", { status: 400 });
    }

    let otp = "";

    for (let i = 0; i < 6; i++) {
      const digit = crypto.randomInt(0, 10);

      otp += digit.toString();
    }

    const expiresAt = new Date(new Date().getTime() + 10 * 60000);

    const data = {
      otp: parseInt(otp, 10),
      otpExpires: expiresAt,
    };

    await dbConnect();

    await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(otp, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);

    return NextResponse.json(`Error fetching products: ${error.message}`, {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json("User ID is required", { status: 400 });
    }

    const { otp } = await req.json();

    if (!otp) {
      return NextResponse.json("OTP is required", { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }

    const isOtpExpired = new Date() > new Date(user.otpExpires);
    const isOtpMatch = user.otp === parseInt(otp, 10);

    if (!isOtpMatch || isOtpExpired) {
      return NextResponse.json("Invalid or expired OTP", { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    const token = jwt.sign(
      { userId: user._id, isVerified: user.isVerified },
      secret,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "OTP verified successfully", token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(`Error verifying OTP: ${error.message}`, {
      status: 500,
    });
  }
}
