import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Coupon from "@/model/coupon";

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Coupon ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json("Coupon deleted successfully", { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
