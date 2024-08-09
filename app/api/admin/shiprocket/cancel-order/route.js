import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { checkAuthorization } from "@/config/checkAuthorization";

export async function POST(req) {
  const headerList = headers();

  const token = headerList.get("authorization");

  try {
    const isAdmin = await checkAuthorization(req);

    if (isAdmin === "Unauthorized" || !isAdmin) {
      return NextResponse.json("Unauthorized Request", { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/cancel",
      {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      }
    );

    const shiprocketInfo = await res.json();

    return NextResponse.json(shiprocketInfo, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
