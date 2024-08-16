import { Suspense } from "react";
import { headers } from "next/headers";

import ImageSlider from "@/components/layout/products/productDetails/ImageSlider";
import ProductInfo from "@/components/layout/products/productDetails/ProductInfo";
import RecommendedProductsByCategory from "@/components/layout/products/product/RecommendedProductsByCategory";
import RecommendedProductsBySubCategory from "@/components/layout/products/product/RecommendedProductsBySubCategory";

const getProductById = async (productId) => {
  const headersList = headers();

  const activePath = headersList.get("x-url");

  try {
    const res = await fetch(`${activePath}/api/product/${productId}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return {
        success: false,
        message: "Failed to fetch Product Details",
        status: res.status,
        data: null,
      };
    }

    const data = await res.json();
    return {
      success: true,
      message: "Product details fetched successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while fetching the product details",
      data: null,
    };
  }
};

export default async function ProductData({ params: { productId } }) {
  const productData = await getProductById(productId);
  console.log(productData.data.subCategory.name);
  if (!productData.success) {
    return <div>{productData.message}</div>;
  }

  return (
    <Suspense>
      <div className="flex gap-6 flex-col md:flex-row justify-center mb-16">
        <ImageSlider data={productData.data?.images} />
        <ProductInfo product={productData.data} />
      </div>
      <RecommendedProductsBySubCategory
        categoryName={productData.data.category}
        subCategoryName={productData.data.subCategory.name}
      />
      <RecommendedProductsByCategory categoryName={productData.data.category} />
    </Suspense>
  );
}
