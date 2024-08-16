"use client";

import { IoIosHeart } from "react-icons/io";
import React, { Suspense, useEffect, useState } from "react";

import ProductList from "@/components/layout/products/ProductList";
import Heading from "@/components/ui/heading/Heading";
import PaginationBtn from "@/components/ui/PaginationBtn";
import ProductListSkeleton from "@/components/ui/skeletons/product/ProductListSkeleton";
import { useSearchParams } from "next/navigation";

const getWishlist = async (page, size) => {
  try {
    const res = await fetch(`/api/user/my-wishlist?page=${page}&size=${size}`, {
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return {
        success: false,
        message: "Failed to fetch data",
        status: res.status,
        data: [],
        meta: { page: 1, size: 12, totalPages: 1, totalItems: 0 },
      };
    }

    const data = await res.json();

    return {
      success: true,
      data: data.data,
      meta: data.meta,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while fetching the wishlist",
      data: [],
      meta: { page: 1, size: 12, totalPages: 1, totalItems: 0 },
    };
  }
};

const WishlistPage = () => {
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const size = parseInt(searchParams.get("size")) || 12;

  const [wishlistData, setWishlistData] = useState({
    success: false,
    data: [],
    meta: { page: 1, size: 12, totalPages: 1, totalItems: 0 },
  });

  useEffect(() => {
    const fetchWishlist = async () => {
      const data = await getWishlist(page, size);
      setWishlistData(data);
    };

    fetchWishlist();
  }, [page, size]);

  if (!wishlistData.success) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="my-10 text-xl font-semibold">
          {wishlistData.message}
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-grow mx-4 my-5 flex flex-col gap-5">
        <Heading
          icon={
            <div className="bg-gradient-to-r from-red-400 to-pink-400 p-1 rounded-full inline-block">
              <IoIosHeart size={18} color="white" />
            </div>
          }
          title={"Your Wishlists"}
        />

        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList products={wishlistData.data} isWishlist={false} />
        </Suspense>

        <PaginationBtn totalPages={wishlistData.meta.totalPages} />
      </div>
    </main>
  );
};

export default WishlistPage;
