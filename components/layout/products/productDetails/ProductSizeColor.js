import { useSession } from "next-auth/react";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

import React from "react";
import { toast } from "sonner";

import BuyNowBtn from "./button/BuyNowBtn";
import AddToCartBtn from "./button/AddToCartBtn";

const ProductSizeColor = ({
  sizes,
  selectedSize,
  selectedColor,
  handleSelectedColor,
  handleSelectedSize,
  selectedColorHex,
  product,
}) => {
  const { data: session, status } = useSession();

  return status === "loading" ? (
    <div className="flex justify-center items-center my-8">
      <AiOutlineLoading3Quarters size={32} className="animate-spin" />
    </div>
  ) : session?.user.role === "admin" ? (
    <div className="overflow-x-auto rounded-md">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-300">
            <th className="py-2 px-4 border-b text-center">Size</th>
            <th className="py-2 px-4 border-b text-center">Colour</th>
            <th className="py-2 px-4 border-b text-center">Stock Quantity</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((size, sizeIdx) => (
            <React.Fragment key={size.size}>
              {size.colours.map((colour, colourIdx) => (
                <tr
                  key={`${size.size}-${colour.colour.name}`}
                  className={sizeIdx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  {colourIdx === 0 && (
                    <td
                      rowSpan={size.colours.length}
                      className="py-2 px-4 border-b text-center align-middle uppercase"
                    >
                      {size.size}
                    </td>
                  )}
                  <td
                    className="py-2 px-4 flex items-center justify-center gap-2 border-l border-b text-center"
                    style={{
                      background: colour.quantity <= 0 ? "#fecaca" : "",
                    }}
                  >
                    <div
                      style={{ background: `${colour.colour.hex}` }}
                      className="w-3 h-3 rounded-full"
                    ></div>
                    <div className="min-w-20 text-left capitalize">
                      {colour.colour.name}
                    </div>
                  </td>
                  <td
                    className="py-2 px-4 border-b text-center"
                    style={{
                      background: colour.quantity <= 0 ? "#fecaca" : "",
                    }}
                  >
                    {colour.quantity}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-gray-500 font-400 text-md leading-4 font-semibold capitalize">
          Choose Size
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0 uppercase">
          {sizes.map((item, index) => (
            <div
              key={index}
              className={`border px-3 py-1 rounded-md cursor-pointer text-xs uppercase ${
                selectedSize === item.size
                  ? "border-[#52057B] text-[#52057B] bg-[#F0E5FF]"
                  : "border-black text-black"
              }`}
              onClick={() => handleSelectedSize(item.size)}
            >
              {item.size}
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-gray-500 font-400 text-md leading-4 font-semibold capitalize">
          Choose Colour
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0 capitalize">
          {sizes
            .filter((item) => !selectedSize || item.size === selectedSize)
            .flatMap((size) => size.colours)
            .map((color, idx) => {
              const isSelected =
                selectedColor === color.colour.name.toLowerCase();
              const isOutOfStock = color.quantity <= 0;
              const commonClasses = `flex flex-row border px-3 py-1 rounded-md items-center gap-2 ${
                isSelected
                  ? "border-[#52057B] text-[#52057B] bg-[#F0E5FF]"
                  : "border-black text-black"
              } ${
                isOutOfStock
                  ? "opacity-50 cursor-not-allowed border-opacity-50"
                  : "cursor-pointer"
              }`;

              return (
                <div
                  className={commonClasses}
                  onClick={() => {
                    if (isOutOfStock) {
                      toast.error(
                        `${color.colour.name} colour is out of stock!, please select another colour.`
                      );
                      return;
                    }
                    handleSelectedColor(color.colour.name, color.colour.hex);
                  }}
                  key={idx}
                >
                  <div
                    className="h-3 w-3 rounded-xl"
                    style={{ backgroundColor: color.colour.hex }}
                    title={color.colour.name}
                  ></div>
                  <div
                    className={`text-xs capitalize ${
                      isOutOfStock ? "opacity-50 text-red" : ""
                    }`}
                    title={color.colour.name}
                  >
                    {color.colour.name}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
        <AddToCartBtn
          productColor={selectedColor}
          productSize={selectedSize}
          productHex={selectedColorHex}
          price={product.price}
          discount={product.discount}
        />

        <BuyNowBtn
          productColor={selectedColor}
          productSize={selectedSize}
          productHex={selectedColorHex}
          price={product.price}
          discount={product.discount}
        />
      </div>
    </div>
  );
};

export default ProductSizeColor;
