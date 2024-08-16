"use client";

import { HeartIcon } from "@heroicons/react/24/solid";

import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";

import ProductCarousel from "../products/ProductCarousel";
import Heading from "@/components/ui/heading/Heading";
import ProductListSkeleton from "@/components/ui/skeletons/product/ProductListSkeleton";

const ProfileWishlist = () => {
  const [wishlistData, setWishlistData] = useState({
    success: false,
    data: [],
    meta: { page: 1, size: 12, totalPages: 1, totalItems: 0 },
  });

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`/api/user/my-wishlist`, {
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
      };
    }
  };

  useEffect(() => {
    const getWishlistData = async () => {
      const products = await fetchWishlist();
      setWishlistData(products);
    };

    getWishlistData();
  }, []);

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
    <div className="block w-full space-y-2">
      <Heading
        icon={
          <div className="bg-gradient-to-r from-red-400 to-pink-400 p-1 rounded-full inline-block">
            <HeartIcon color="white" className="w-5 h-5" />
          </div>
        }
        title="Wishlist"
        buttons={[
          <Link
            href="/wishlist"
            key="wishlist"
            className="px-3 py-1.5 rounded-lg text-black hover:bg-gray-100 hover:scale-105 transition-all duration-100 underline hover:no-underline underline-offset-4"
          >
            View All
          </Link>,
        ]}
      />

      <Suspense fallback={<ProductListSkeleton />}>
        {wishlistData.success && (
          <ProductCarousel products={wishlistData.data} />
        )}
      </Suspense>
    </div>
  );
};

export default ProfileWishlist;
