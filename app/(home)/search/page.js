import React, { Suspense } from "react";

import { ProductCard } from "@/components/layout/admin/products/ProductCard";

import PaginationBtn from "@/components/ui/PaginationBtn";
import ProductListSkeleton from "@/components/ui/skeletons/product/ProductListSkeleton";
import ProductItem from "@/components/layout/products/ProductItem";

async function getSearchResults(searchParams) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/search?query=${
        searchParams.query
      }&page=${searchParams.page || 1}&size=12`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      return {
        success: false,
        message: "Failed to fetch search results",
        status: res.status,
        data: [],
        meta: {
          page: searchParams.page || 1,
          size: 12,
          totalPages: 1,
          totalItems: 0,
        },
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
      message: "An error occurred while fetching the search results",
      data: [],
      meta: {
        page: searchParams.page || 1,
        size: 12,
        totalPages: 1,
        totalItems: 0,
      },
    };
  }
}

const page = async ({ searchParams }) => {
  const data = await getSearchResults(searchParams);

  return (
    <main className="relative p-4 sm:p-8 bg-gray-50">
      <h2 className="text-2xl lg:text-4xl font-bold text-center text-pink-500 font-aclonica leading-tight mb-4 sm:mb-8">
        Search Results for {searchParams.query}
      </h2>

      <Suspense fallback={<ProductListSkeleton />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-4 gap-4">
          {data.data?.map((result) => {
            return (
              <div key={result._id}>
                <ProductItem key={result._id} product={result} />
              </div>
            );
          })}
        </div>
      </Suspense>

      <PaginationBtn totalPages={data.meta.totalPages} />
    </main>
  );
};

export default page;
