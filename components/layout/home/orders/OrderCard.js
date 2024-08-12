import { Card, CardBody } from "@material-tailwind/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const statusColors = {
  confirmed: " text-blue-800",
  pending: " text-yellow-800",
  shipped: " text-indigo-800",
  delivered: " text-green-800",
  canceled: " text-red-800",
};
const OrderCard = ({ order }) => {
  const status = order.status;
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(
      new Date(order.createdAt).toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [order.createdAt]);
  return (
    <Link href={`/my-orders/${order._id}`}>
      <Card className="mt-6  w-96 border cursor-pointer hover:shadow-blue-100 hover:scale-105 transition-all duration-500">
        <CardBody className="p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center ">
            <div className="flex gap-1 items-center">
              Order Date: <div className="text-xs">{formattedDate}</div>
            </div>
          </div>

          {order.cartItems.length == 1 ? (
            <div>Total Product: {order.cartItems.length}</div>
          ) : (
            <div>Total Products: {order.cartItems.length}</div>
          )}
          <div className="flex items-center gap-2">
            Total Amount: <div className="text-teal-500">₹{order.totalAmount.toFixed(2)}</div>
          </div>
          <div>
            Status:{" "}
            <span className={`${statusColors[status]} capitalize`}> {order.status}</span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};

export default OrderCard;
