"use client";

import ImageContainer from "@/components/ui/ImageContainer";

const CheckoutProductCard = ({ data }) => {
  return (
    <div className="border border-gray-300 rounded-xl p-2.5 flex gap-3 bg-white shadow-sm relative">
      <div className="w-4/12 min-h-28">
        <ImageContainer width={120} height={120} image={data.images.url} />
      </div>

      <div className="flex flex-col w-full">
        <p className="font-bold capitalize">{data.title}</p>
        <div className="flex gap-1 items-center">
          <p className="text-green-500 font-medium">
            ₹{" "}
            <span>
              {(data.price - (data.discount * data.price) / 100).toFixed(2)}
            </span>
          </p>

          <p className="text-xs line-through">
            ₹ <span>{data.price.toFixed(2)}</span>
          </p>
        </div>
        <p className="text-gray-700 text-sm">
          Quantity: <span>{data.quantity}</span>
        </p>
        <p className="text-gray-700 text-sm flex items-center gap-1 mt-px">
          Size & Colour:
          <span className="uppercase">{data.size}</span> /
          <div className="flex items-center gap-1 capitalize">
            <div
              style={{ background: `${data.color.hex}` }}
              className="w-3 h-3 rounded-full"
            ></div>
            {data.color.name}
          </div>
        </p>
      </div>
    </div>
  );
};

export default CheckoutProductCard;
