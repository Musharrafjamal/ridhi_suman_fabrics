"use client";

import { Button } from "@material-tailwind/react";

import { toast } from "sonner";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

import ImageContainer from "../ui/ImageContainer";
import CartQuantityButton from "./CartQuantityButton";

import { removeItemFromCart } from "@/redux/slice/cartSlice";

const CartItems = ({ data }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleRemoveItem = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/cart`,
        {
          method: "DELETE",
          body: JSON.stringify({ productId: data._id }),
        }
      );

      const message = await res.json();

      if (!res.ok) {
        toast.error(message);

        setLoading(false);
      }

      dispatch(removeItemFromCart(data._id));

      toast.success("Item removed from cart");

      setLoading(false);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Error removing item from cart");

      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-xl p-2.5 flex gap-3 bg-white shadow-sm relative">
      <div
        style={{
          borderColor: data?.color?.hex || "gray",
        }}
        className="absolute right-3 top-3 px-1.5 rounded flex items-center text-xs border-2"
      >
        <p className="text-black uppercase">{data.size}/</p>
        <p className="text-black capitalize"> {data?.color?.name}</p>
      </div>

      <div className="w-4/12 min-h-28">
        <ImageContainer width={120} height={120} image={data.images.url} />
      </div>

      <div className="flex flex-col justify-between py-1 w-full">
        <p className="font-bold capitalize">{data.title}</p>

        <div>
          <div className="flex gap-1 items-center">
            <p className="text-green-500 font-medium">
              ₹{" "}
              <span>
                {(data.price - (data.discount * data.price) / 100).toFixed(2)}
              </span>
            </p>

            <p className="text-xs line-through">
              ₹ <span>{data.price.toFixed(2)}</span>
            </p>
          </div>

          <p className="text-gray-700 text-sm">
            Quantity: <span>{data.quantity}</span>
          </p>
        </div>

        <div className="flex justify-between items-end mr-3 w-full">
          <CartQuantityButton data={data} />

          <Button
            color="white"
            size="sm"
            variant="text"
            className="shadow-none p-0 hover:shadow-none hover:underline text-red-400"
            onClick={handleRemoveItem}
            disabled={loading}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
