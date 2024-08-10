import React from "react";
import { IoBagOutline } from "react-icons/io5";
import CartItemsList from "../order-details/CartItemsList";

const OrderSummary = ({ data }) => {
  return (
    <div className="rounded-lg flex flex-col justify-between border-2 border-gray-500 w-full lg:w-1/2 p-5 ">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="flex gap-1 text-black text-lg">
            <IoBagOutline size={22} />
            ORDER SUMMARY
          </h1>
          <p className="text-gray-600 text-xs md:text-base">
            The sum of total payments for goods there
          </p>
        </div>
        <div className="overflow-auto max-h-96 px-0">
          {data.cartItems.length > 0 && data.cartItems.map((product, index) => (
            <CartItemsList key={index} product={product} data={data} />
          ))}
        </div>
      </div>
      <div className="w-full text-gray-800 flex flex-col gap-3 mt-5 lg:mt-0">
        <div className="flex justify-between font-bold">
          <span>Subtotal</span>
          <span>&#x20B9; {data.totalAmount - 120}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Service</span>
          <span>&#x20B9;120.00</span>
        </div>
        <div className="h-[2px] bg-gray-300"></div>
        <div className="flex justify-between text-black font-bold mt-1">
          <span>Total</span>
          <span>&#x20B9; {data.totalAmount} </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
