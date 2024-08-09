import { NextResponse } from "next/server";

import { checkAuthorization } from "@/config/checkAuthorization";

export async function POST(req) {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  try {
    const isAdmin = await checkAuthorization(req);

    if (isAdmin === "Unauthorized" || !isAdmin) {
      return NextResponse.json("Unauthorized Request", { status: 401 });
    }

    const res = await fetch(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const shiprocketToken = await res.json();

    return NextResponse.json(shiprocketToken, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
