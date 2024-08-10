"use client";
import React, { useEffect, useState } from "react";
import SmProductCard from "@/components/cards/SmProductCard";
import { toast } from "sonner";
import Link from "next/link";

const CartItemsList = ({ product }) => {
  const id = product.productId._id;
  const qty = product.quantity;
  const size = product.size;
  const color = product.colour.name;
  const colorHex = product.colour.hex;
  return (
    <Link href={`/products/${id}`} className="flex flex-col gap-2 w-full">
      <SmProductCard
        product={product.productId}
        qty={qty}
        size={size}
        color={color}
        colorHex={colorHex}
      />
    </Link>
  );
};

export default CartItemsList;
