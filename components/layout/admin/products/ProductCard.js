"use client";

import { FiEdit } from "react-icons/fi";
import { CiDiscount1 } from "react-icons/ci";
import { IoOpenOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { CardBody, Button } from "@material-tailwind/react";

import Link from "next/link";
import Image from "next/image";
import { FaBoxes } from "react-icons/fa";

export function ProductCard({
  product,
  setOpenDeleteDialog,
  setSelectedProduct,
}) {
  return (
    <div className="group relative h-[32rem] flex flex-col justify-between overflow-hidden">
      <Image
        fill
        src={product?.images[0]?.url}
        alt="Product Image"
        style={{
          filter: `${product.visibility ? "grayscale(0)" : "grayscale(100%)"}`,
        }}
        className="group-hover:scale-105 transition-all absolute w-full object-cover"
      />

      <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-transparent to-black/40" />

      <div className="relative p-2 w-full flex gap-2 justify-end bg-gradient-to-b from-white/50 to-transparent">
        <div className="w-11 h-8 bg-yellow-500 rounded-md flex justify-center items-center gap-1 font-semibold">
          <FaBoxes />
          {product.orders?.length}
        </div>
        <Link
          href={`/admin/products/${product._id}`}
          className="flex gap-2 w-8 h-8 justify-center items-center rounded-md bg-white"
        >
          <button
            className="text-gray-800 hover:scale-110 transition-all"
            title="Edit"
          >
            <FiEdit />
          </button>
        </Link>

        <div
          onClick={() => {
            setOpenDeleteDialog(true);
            setSelectedProduct(product);
          }}
          className="flex gap-2 w-8 h-8 justify-center items-center rounded-md bg-white"
        >
          <button
            className="text-red-500 hover:scale-110 transition-all"
            title="Delete"
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      </div>

      <CardBody className="relative bg-white flex flex-col gap-2 p-2 rounded-lg m-4">
        <div className="flex justify-between items-center">
          <div className="text-lg uppercase font-semibold truncate w-8/12">
            {product.title}
          </div>

          <div
            style={{
              background: `${product.subCategory.colour}`,
            }}
            className="w-fit font-medium text-black py-0.5 rounded-md px-2 text-sm truncate "
          >
            {product.category} / {product.subCategory.name}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <div className="text-pink-500 font-semibold">
              ₹
              {(
                product.price -
                (product.discount / 100) * product.price
              ).toFixed(2)}
            </div>

            <div className="text-xs line-through">₹{product.price}</div>
          </div>

          <div className="flex gap-1 items-center">
            <CiDiscount1 className="text-red-500 w-5 h-5" />

            <p className="text-red-500">
              <span className="">{product.discount}%</span>{" "}
              <span className="text-xs">OFF</span>
            </p>
          </div>
        </div>

        <Link href={`/products/${product._id}`} className="w-full">
          <Button
            variant="gradient"
            size="sm"
            className="w-full flex items-center gap-1 justify-center"
          >
            View
            <IoOpenOutline />
          </Button>
        </Link>
      </CardBody>
    </div>
  );
}
