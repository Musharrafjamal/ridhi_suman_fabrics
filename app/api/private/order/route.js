// import { NextResponse } from "next/server";

// import User from "@/model/user";
// import Order from "@/model/order";
// import Product from "@/model/product";

// import dbConnect from "@/config/db";
// import { checkAuthorization } from "@/config/checkAuthorization";

// export async function POST(request) {
//   try {
//     // const isAdmin = await checkAuthorization(request);

//     // if (!isAdmin) {
//     //   return NextResponse.json(
//     //     { error: "Unauthorized Request" },
//     //     { status: 401 }
//     //   );
//     // }

//     await dbConnect();

//     let data = await request.json();

//     const userExist = await User.findById(data.user);
//     if (!userExist) {
//       return NextResponse.json("user not exist", { status: 400 });
//     }

//     console.log(data);

//     const checkProduct = data.cartItems.map(async (item) => {
//       try {
//         const product = await Product.findById(item.productId)
//           .select("sizes orders")
//           .exec();

//         if (!product) {
//           return NextResponse.json(
//             `Product with ID ${item.productId} not found.`,
//             { status: 201 }
//           );
//         }

//         let isUpdated = false;
//         let isQuantityAvailable = true;

//         product.sizes = product.sizes.map((size) => {
//           if (size.size.toLowerCase() === item.size.toLowerCase()) {
//             size.colours = size.colours.map((colour) => {
//               if (
//                 colour.colour.name.toLowerCase() ===
//                 item.colour.name.toLowerCase()
//               ) {
//                 const newQuantity =
//                   parseInt(colour.quantity, 10) - parseInt(item.quantity, 10);
//                 if (newQuantity < 0) {
//                   isQuantityAvailable = false;
//                 } else {
//                   colour.quantity = newQuantity;
//                   isUpdated = true;
//                 }
//               }
//               return colour;
//             });
//           }
//           return size;
//         });

//         if (!isQuantityAvailable) {
//           return NextResponse.json(
//             `Insufficient quantity for product ID ${item.productId}, size ${item.size}, color ${item.colour.name}.`,
//             { status: 400 }
//           );
//         }
//       } catch (error) {
//         return NextResponse.json("Something Went Wrong.", { status: 500 });
//       }
//     });

//     const order = await Order.create(data);

//     await User.findByIdAndUpdate(order.user, {
//       $set: { cart: [] },
//       $push: { orders: order._id },
//     });

//     const updatePromises = order.cartItems.map(async (item) => {
//       try {
//         const product = await Product.findById(item.productId)
//           .select("sizes orders")
//           .exec();
//         if (!product) {
//           console.error(`Product with ID ${item.productId} not found.`);
//           return null;
//         }

//         let isUpdated = false;

//         product.sizes = product.sizes.map((size) => {
//           if (size.size.toLowerCase() === item.size.toLowerCase()) {
//             size.colours = size.colours.map((colour) => {
//               if (
//                 colour.colour.name.toLowerCase() ===
//                 item.colour.name.toLowerCase()
//               ) {
//                 colour.quantity =
//                   parseInt(colour.quantity, 10) - parseInt(item.quantity, 10);
//                 isUpdated = true;
//               }
//               return colour;
//             });
//           }
//           return size;
//         });

//         if (isUpdated) {
//           await product.save();

//           await Product.findByIdAndUpdate(
//             item.productId,
//             { $push: { orders: order._id } },
//             { new: true, runValidators: true }
//           ).exec();
//         }

//         return product;
//       } catch (error) {
//         console.error("Error processing cart item:", error);
//         return null;
//       }
//     });

//     await Promise.all(updatePromises);

//     return NextResponse.json(order, { status: 201 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: err }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";

import User from "@/model/user";
import Order from "@/model/order";
import Product from "@/model/product";

import dbConnect from "@/config/db";
import { checkAuthorization } from "@/config/checkAuthorization";

export async function POST(request) {
  try {
    const isAdmin = await checkAuthorization(request);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized Request" },
        { status: 401 }
      );
    }

    await dbConnect();

    let data = await request.json();

    const userExist = await User.findById(data.user);

    if (!userExist) {
      return NextResponse.json("User not exist", { status: 400 });
    }

    for (const item of data.cartItems) {
      const product = await Product.findById(item.productId)
        .select("sizes")
        .exec();

      if (!product) {
        return NextResponse.json(
          `Product with ID ${item.productId} not found.`,
          { status: 404 }
        );
      }

      let isQuantityAvailable = false;

      for (const size of product.sizes) {
        if (size.size.toLowerCase() === item.size.toLowerCase()) {
          for (const colour of size.colours) {
            if (
              colour.colour.name.toLowerCase() === item.colour.toLowerCase()
            ) {
              const newQuantity =
                parseInt(colour.quantity, 10) - parseInt(item.quantity, 10);

              if (newQuantity >= 0) {
                isQuantityAvailable = true;
              }
            }
          }
        }
      }

      if (!isQuantityAvailable) {
        return NextResponse.json(
          `Insufficient quantity for product ID ${item.productId}, size ${item.size}, color ${item.colour}.`,
          { status: 400 }
        );
      }
    }

    const order = await Order.create(data);

    await User.findByIdAndUpdate(order.user, {
      $set: { cart: [] },
      $push: { orders: order._id },
    });

    const updatePromises = order.cartItems.map(async (item) => {
      const product = await Product.findById(item.productId)
        .select("sizes orders")
        .exec();

      if (!product) {
        return NextResponse.json(
          `Product with ID ${item.productId} not found.`,
          { status: 404 }
        );
      }

      let isUpdated = false;

      product.sizes = product.sizes.map((size) => {
        if (size.size.toLowerCase() === item.size.toLowerCase()) {
          size.colours = size.colours.map((colour) => {
            if (
              colour.colour.name.toLowerCase() === item.colour.toLowerCase()
            ) {
              colour.quantity =
                parseInt(colour.quantity, 10) - parseInt(item.quantity, 10);
              isUpdated = true;
            }
            return colour;
          });
        }
        return size;
      });

      if (isUpdated) {
        await product.save();

        await Product.findByIdAndUpdate(
          item.productId,
          { $push: { orders: order._id } },
          { new: true, runValidators: true }
        ).exec();
      }

      return product;
    });

    await Promise.all(updatePromises);

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
