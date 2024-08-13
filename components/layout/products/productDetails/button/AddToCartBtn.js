"use client";

import { Button } from "@material-tailwind/react";
import {
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";

import React from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  addItemToCart,
  updateCart,
  updateItemQuantity,
} from "@/redux/slice/cartSlice";
import { toggleCartDrawer } from "@/redux/slice/modalSlice";

const AddToCartBtn = ({
  price,
  discount,
  productColor,
  productSize,
  productHex,
}) => {
  const dispatch = useDispatch();
  const { productId } = useParams();

  const cart = useSelector((state) => state.cart);

  const isInCart = cart.items?.find((item) => item._id === productId);

  const handleQuantityButton = async (e, qty) => {
    e.stopPropagation();
    e.preventDefault();

    const product = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/cart`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: qty,
          color: {
            name: isInCart.color?.name,
            hex: isInCart.color?.hex,
          },
          size: isInCart.size,
        }),
      }
    );

    const data = await product.json();

    if (product.ok) {
      dispatch(
        updateItemQuantity({
          itemId: productId,
          quantity: isInCart.quantity + qty,
          color: {
            name: isInCart.color?.name,
            hex: isInCart.color?.hex,
          },
          size: isInCart.size,
        })
      );

      toast.info("Product quantity updated");
    } else {
      toast.error(data);
    }
  };

  const handleButtonClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (productColor === null || productSize === null) {
      toast.warning("Please select product size and color");
      return;
    }

    const product = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/cart`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          color: {
            name: productColor,
            hex: productHex,
          },
          size: productSize,
        }),
      }
    );

    const data = await product.json();

    if (product.ok) {
      dispatch(addItemToCart(data));

      dispatch(
        updateCart({
          totalQuantity: cart.totalQuantity + 1,
          totalPrice:
            Number(cart.totalPrice) +
            Number((price - (discount / 100) * price).toFixed(2)),
        })
      );

      dispatch(toggleCartDrawer());

      toast.success("Product added to cart.");
    } else {
      toast.error(data);
    }
  };

  return isInCart ? (
    <div className="flex justify-between w-full">
      <Button
        className="p-2 bg-transparent border border-pink-500 shadow-none hover:scale-105 active:scale-100"
        onClick={(e) => handleQuantityButton(e, -1)}
        disabled={isInCart.quantity <= 1}
      >
        <MinusIcon className="h-4 w-4 text-pink-500" />
      </Button>

      {isInCart.quantity}

      <Button
        className="p-2 bg-transparent border border-green-400 shadow-none hover:scale-105 active:scale-100"
        onClick={(e) => handleQuantityButton(e, 1)}
      >
        <PlusIcon className="h-4 w-4 text-green-400" />
      </Button>
    </div>
  ) : (
    <Button
      className="flex gap-1 items-center justify-center rounded"
      fullWidth
      variant="outlined"
      color="pink"
      size="md"
      onClick={handleButtonClick}
    >
      <ShoppingCartIcon className="h-5 w-5" />
      Add to Cart
    </Button>
  );
};

export default AddToCartBtn;
