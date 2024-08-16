import Order from "@/model/order";
import axios from "axios";
import { NextResponse } from "next/server";
import sha256 from "sha256";

export async function GET(req, { params }) {
  const { MTID } = params;

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!MTID)
    return NextResponse.json("Transaction is not found!", { status: 400 });
  if (!orderId)
    return NextResponse.json("Order id is required!", { status: 400 });

  const { PHONEPE_MERCHANT_ID, PHONEPE_BASE_URL, PHONEPE_SALT_KEY } =
    process.env;
  const saltIndex = 1;
  const checkEndPoint = "/pg/v1";

  const checksum =
    sha256(
      `${checkEndPoint}/status/${PHONEPE_MERCHANT_ID}/${MTID}` +
        PHONEPE_SALT_KEY
    ) +
    "###" +
    saltIndex;

  try {
    // Set request options for axios
    const options = {
      method: "GET",
      url: `${PHONEPE_BASE_URL}${checkEndPoint}/status/${PHONEPE_MERCHANT_ID}/${MTID}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": `${PHONEPE_MERCHANT_ID}`,
      },
    };

    const response = await axios.request(options);

    if (response.data.success) {
      const order = await Order.findById(orderId);
      if (!order) {
        return NextResponse.json("Invalid order id", { status: 500 });
      }
      order.isPaid = true;
      order.transactionId = MTID;
      order.status = "pending";
      order.canceledBy = null;
      order.cancellationReason = null;
      await order.save();
    }
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error during checking payment status:", error);
    return NextResponse.json(
      { error: "Checking payment status failed", details: error.message },
      { status: 500 }
    );
  }
}
