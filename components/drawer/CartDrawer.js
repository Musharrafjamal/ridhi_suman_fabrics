"use client";

import React, { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";

import Link from "next/link";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import CartItems from "./CartItems";

import CartListSkeleton from "../ui/skeletons/product/CartListSkeleton";

import { toggleCartDrawer } from "@/redux/slice/modalSlice";
import { addItemToCart, updateCart } from "@/redux/slice/cartSlice";

const CartDrawer = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/cart`
      );

      const data = await res.json();

      dispatch(addItemToCart(data.data));
      dispatch(
        updateCart({
          totalQuantity: data.totalQuantity,
          totalPrice: data.totalAmount,
        })
      );

      setLoading(false);
    } catch (error) {
      toast.error("Error fetching cart items");

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const open = useSelector((state) => state.modal.cartDrawer);

  const toggleDrawer = () => {
    dispatch(toggleCartDrawer());
  };

  return (
    <Drawer
      placement="right"
      open={open}
      onClose={toggleDrawer}
      className="px-8 py-4 shadow-lg bg-gray-100 flex flex-col justify-between"
      size={480}
      overlay={false}
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="spacey-2">
          <Typography variant="h5" color="blue-gray">
            Your Cart Items
          </Typography>

          <p className="text-sm w-10/12">
            Go to cart for checkout and confirm the order.
          </p>
        </div>

        <IconButton variant="text" color="blue-gray" onClick={toggleDrawer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </div>

      {loading ? (
        <CartListSkeleton />
      ) : (
        <section className="flex-grow overflow-scroll space-y-3 hide-scroll">
          {cart?.items?.length !== 0 && cart?.items ? (
            cart?.items?.map((item, index) => (
              <CartItems key={index} data={item} cart={cart} />
            ))
          ) : (
            <div className="bg-gray-200 py-2 px-4 text-center rounded-md mt-4">
              No Cart Items
            </div>
          )}
        </section>
      )}

      <div className="mt-8 border-t py-2 border-gray-400 relative space-y-4">
        <div className="flex justify-between mx-3 mb-2">
          <Typography variant="h6" color="blue-gray">
            Total Amount
          </Typography>

          <Typography variant="h6" color="blue-gray">
            {cart?.items?.length === 0 ? (
              <p>₹0</p>
            ) : (
              <p>
                {" ₹"}
                {cart.totalPrice ? Number(cart.totalPrice).toFixed(2) : "0"}
              </p>
            )}
          </Typography>
        </div>
        {cart?.items?.length === 0 ? (
          <Button color="pink" disabled variant="gradient" className="w-full">
            Checkout
          </Button>
        ) : (
          <Link href="/checkout">
            <Button
              color="pink"
              variant="gradient"
              className="w-full"
              onClick={toggleDrawer}
            >
              Checkout
            </Button>
          </Link>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
