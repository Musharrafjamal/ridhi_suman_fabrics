import { Suspense } from "react";

import ProductCarousel from "../ProductCarousel";
import ProductListSkeleton from "@/components/ui/skeletons/product/ProductListSkeleton";

async function getRecommendedProductsBySubCategory(categoryName, subCategoryName) {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/product/category/${categoryName}/${subCategoryName}?page=${1}&size=12`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return {
        success: false,
        message: "Failed to fetch most booked product",
        status: res.status,
        data: [],
      };
    }

    const data = await res.json();

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error fetching most booked product:", error);

    return {
      success: false,
      message: "An error occurred while fetching the most booked product",
      data: [],
    };
  }
}

const RecommendedProductsBySubCategory = async ({categoryName, subCategoryName}) => {
  const data = await getRecommendedProductsBySubCategory(categoryName, subCategoryName);

  return (
    <>
      <Suspense fallback={<ProductListSkeleton />}>
        {data.success && (
          <ProductCarousel
            products={data.data.data}
            label={`Recommended Products by ${subCategoryName}`}
          />
        )}
      </Suspense>
    </>
  );
};

export default RecommendedProductsBySubCategory;
