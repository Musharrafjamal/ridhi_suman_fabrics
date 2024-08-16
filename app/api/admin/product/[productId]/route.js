import { storage } from "@/firebase";
import { NextResponse } from "next/server";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import dbConnect from "@/config/db";
import { checkAuthorization } from "@/config/checkAuthorization";

import User from "@/model/user";
import Product from "@/model/product";

export async function PUT(request, { params }) {
  let imageObjects = [];

  try {
    const isAdmin = await checkAuthorization(request);

    const { productId } = params;

    if (isAdmin === "Unauthorized" || !isAdmin) {
      return NextResponse.json("Unauthorized Request", { status: 401 });
    }

    const formData = await request.formData();

    const title = formData.get("title");
    const price = formData.get("price");
    const discount = formData.get("discount");
    const visibility = formData.get("visibility");
    const description = formData.get("description");
    const category = formData.get("category");
    const subCategory = JSON.parse(formData.get("subCategory"));
    const fabric = formData.get("fabric");
    const brand = formData.get("brand");
    const sizes = JSON.parse(formData.get("sizes"));
    const files = formData.getAll("images");
    const deletedImages = formData.getAll("deletedImages");

    if (
      !title ||
      !price ||
      !discount ||
      !description ||
      !category ||
      !subCategory ||
      !visibility ||
      !fabric ||
      !brand
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (sizes.length < 1) {
      return NextResponse.json(
        { error: "Add a minimum of 1 size!" },
        { status: 400 }
      );
    }

    if (files.length < 4) {
      return NextResponse.json(
        { error: "Add a minimum of 4 images!" },
        { status: 400 }
      );
    }

    await dbConnect();

    deletedImages.map(async (imageObjects) => {
      const parsedImageObject = JSON.parse(imageObjects);
      const imageRef = ref(storage, parsedImageObject.ref);
      await deleteObject(imageRef);
    });

    for (const file of files) {
      if (file instanceof File) {
        const imageRef = ref(
          storage,
          `products/${title}/${file.size + file.name}`
        );

        await uploadBytes(imageRef, file);

        const imageUrl = await getDownloadURL(imageRef);

        imageObjects.push({ url: imageUrl, ref: imageRef.fullPath });
      } else {
        imageObjects.push(JSON.parse(file));
      }
    }

    const productData = {
      title,
      price,
      discount,
      visibility,
      description,
      category,
      subCategory,
      fabric,
      brand,
      sizes,
      images: imageObjects,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedProduct, { status: 201 });
  } catch (error) {
    console.error("Error saving product:", error);

    if (imageObjects.length > 0) {
      await Promise.all(
        imageObjects.map(async (img) => {
          if (img && img.ref) {
            await deleteObject(ref(storage, img.ref));
          }
        })
      );
    }

    return NextResponse.json(`Error saving product: ${error.message}`, {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const isAdmin = await checkAuthorization(request);

    if (!isAdmin) {
      return NextResponse.json("Unauthorized Request", { status: 401 });
    }

    const { productId } = params;
    if (!productId) {
      return NextResponse.json("Id not found", { status: 404 });
    }

    await dbConnect();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json("Product not found", { status: 404 });
    }

    product.images.map(async (imageObject) => {
      if (imageObject && imageObject.ref) {
        const imageRef = ref(storage, imageObject.ref);
        await deleteObject(imageRef);
      }
    });

    await Product.findByIdAndDelete(productId);

    const users = await User.updateMany(
      {},
      {
        $pull: {
          wishlist: productId,
          cart: { product: productId },
        },
      }
    );

    return NextResponse.json("Product deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(`Error deleting product: ${error.message}`, {
      status: 500,
    });
  }
}
