"use client";

import { toast } from "sonner";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

import ProductFooter from "./ProductFooter";
import ProductDetails from "./ProductDetails";
import ProductHeading from "./ProductHeading";
import ProductSizeColor from "./ProductSizeColor";

function ProductInfo({ product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedColorHex, setSelectedColorHex] = useState(null);

  const backgroundColor = product?.subCategory?.colour;

  const cart = useSelector((state) => state.cart);

  const isInCart = cart.items?.find((item) => item._id === product._id);

  const handleSelectedSize = (size) => {
    if (isInCart && isInCart.color && isInCart.color.hex) {
      toast.warning("Remove item from cart to change size");
      return;
    }

    setSelectedSize(size);
    setSelectedColor(null);
  };

  const handleSelectedColor = (color, hex) => {
    if (isInCart && isInCart.color && isInCart.color.name) {
      toast.warning("Remove item from cart to change color");
      return;
    }

    if (selectedSize === null) {
      toast.warning("select size");
      return;
    }
    setSelectedColor(color.toLowerCase());
    setSelectedColorHex(hex);
  };

  useEffect(() => {
    if (isInCart) {
      setSelectedSize(isInCart.size);
      setSelectedColor(isInCart.color?.name);
      setSelectedColorHex(isInCart.color?.hex);
    }

    if (product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].size);
    }
  }, [isInCart, product?.sizes]);

  return (
    <section className="w-full max-w-3xl md:w-2/3 flex flex-col gap-6 p-5 md:px-0 mr-5">
      <ProductHeading {...product} backgroundColor={backgroundColor} />

      <ProductSizeColor
        isInCart={isInCart}
        sizes={product.sizes}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        handleSelectedColor={handleSelectedColor}
        handleSelectedSize={handleSelectedSize}
        product={product}
        selectedColorHex={selectedColorHex}
      />

      <ProductDetails fabric={product.fabric} brand={product.brand} />

      <ProductFooter />
    </section>
  );
}

export default ProductInfo;
