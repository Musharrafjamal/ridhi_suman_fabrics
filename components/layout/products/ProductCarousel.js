"use client";

import { Carousel, IconButton } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

import React, { useState, useEffect, useMemo, Suspense } from "react";

import ProductList from "./ProductList";

import SectionHeading from "@/components/ui/SectionHeading";
import ProductListSkeleton from "@/components/ui/skeletons/product/ProductListSkeleton";

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);

  useEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
};

const ProductCarousel = ({ products, label = "" }) => {
  const [width] = useWindowSize();

  const slides = useMemo(() => {
    let perSlide;

    if (width > 1360) perSlide = 4;
    else if (width > 960) perSlide = 3;
    else if (width > 720) perSlide = 2;
    else perSlide = 1;

    const slides = [];

    for (let i = 0; i < products.length; i += perSlide) {
      slides.push(products.slice(i, i + perSlide));
    }

    return slides;
  }, [products, width]);

  const renderSlides = () => {
    return slides.map((slideItems, index) => (
      <ProductList key={index} products={slideItems} />
    ));
  };

  return (
    <section className="my:0 md:my-10">
      {label.length !== 0 && (
        <SectionHeading label={label} className="text-pink-400" />
      )}

      <Suspense fallback={<ProductListSkeleton />}>
        <Carousel
          prevArrow={({ handlePrev }) => (
            <IconButton
              variant="text"
              color="white"
              size="lg"
              onClick={handlePrev}
              className="!absolute top-2/4 left-4 -translate-y-2/4 bg-white/50 shadow rounded-full hover:bg-white/70 hover:scale-105 active:scale-100 transition-all duration-100 z-30"
            >
              <ChevronLeftIcon className="h-6 w-6 text-black" />
            </IconButton>
          )}
          nextArrow={({ handleNext }) => (
            <IconButton
              variant="text"
              color="white"
              size="lg"
              onClick={handleNext}
              className="!absolute top-2/4 !right-4 -translate-y-2/4 bg-white/50 shadow rounded-full hover:bg-white/70 hover:scale-105 active:scale-100 transition-all duration-100 z-30"
            >
              <ChevronRightIcon className="h-6 w-6 text-black" />
            </IconButton>
          )}
        >
          {renderSlides()}
        </Carousel>
      </Suspense>
    </section>
  );
};

export default ProductCarousel;
