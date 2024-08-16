import { checkAuthorization } from "@/config/checkAuthorization";
import dbConnect from "@/config/db";
import { storage } from "@/firebase";
import User from "@/model/user";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const isAdmin = await checkAuthorization(request);

    if (isAdmin === "Unauthorized" || !isAdmin) {
      return NextResponse.json("Unauthorized request", { status: 401 });
    }
    await dbConnect();

    const users = await User.find();

    const subAdmins = users.filter((user) => user.createdBy === "admin");

    return NextResponse.json(subAdmins, { status: 200 });
  } catch (err) {
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function POST(request) {
  try {
    const isAdmin = await checkAuthorization(request);

    if (isAdmin === "Unauthorized" || !isAdmin) {
      return NextResponse.json("Unauthorized request", { status: 401 });
    }

    const data = await request.formData();
    const name = data.get("name");
    const phoneNumber = data.get("phoneNumber");
    const file = data.get("image");
    const password = data.get("password");

    if (!data) {
      return NextResponse.json("Invalid request!", { status: 400 });
    }

    if (!phoneNumber || !password || !name) {
      return NextResponse.json({ error: "Invalid data!" }, { status: 400 });
    }
    if (!file) {
      return NextResponse.json({ error: "Invalid image!" }, { status: 400 });
    }

    const imageRef = ref(
      storage,
      `admins/${name.replace(/ /g, "-").toLowerCase()}.${phoneNumber}@admin.com`
    );

    // Convert the file to a buffer or blob before uploading
    const buffer = await file.arrayBuffer();
    const blob = new Blob([buffer], { type: file.type });

    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);
    const imageObject = { url: imageUrl, ref: imageRef._location.path_ };
    await dbConnect();

    const phoneNumberExists = await User.findOne({ phoneNumber: phoneNumber });

    if (phoneNumberExists)
      return NextResponse.json("Phone number already exists", { status: 400 });

    const subAdmin = await User.create({
      name,
      email: `${name
        .replace(/ /g, "-")
        .toLowerCase()}.${phoneNumber}@admin.com`,
      phoneNumber,
      image: imageObject,
      password,
      createdBy: "admin",
      isVerified: true,
      role: "admin",
    });

    return NextResponse.json(subAdmin, { status: 200 });
  } catch (err) {
    return NextResponse.json(err.message, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const isAdmin = await checkAuthorization(request);

    if (isAdmin === "Unauthorized" || !isAdmin) {
      return NextResponse.json("Unauthorized request", { status: 401 });
    }
    const data = await request.json();

    if (!data) {
      return NextResponse.json("Invalid request!", { status: 400 });
    }
    await dbConnect();
    const user = await User.findByIdAndUpdate(data._id, data);
    if (!user) {
      return NextResponse.json("User not found", { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json(err.message, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const isAdmin = await checkAuthorization(request);

    if (isAdmin === "Unauthorized" || !isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized request" },
        { status: 401 }
      );
    }

    const data = await request.json();

    if (!data || !data._id || !data.image) {
      return NextResponse.json(
        { message: "Invalid request!" },
        { status: 400 }
      );
    }

    if (data.image) {
      await deleteObject(ref(storage, data.image.ref));
    }

    await dbConnect();
    const user = await User.findByIdAndDelete(data._id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
