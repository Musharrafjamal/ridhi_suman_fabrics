"use client";

import { Button } from "@material-tailwind/react";

const CancelOrderButton = ({ order, setOrders }) => {
  const handleCancelOrder = async () => {
    const fetchOrder = await fetch(`/api/private/order/${order._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await fetchOrder.json();

    const tokenString = localStorage.getItem("shiprocketToken");
    const token = JSON.parse(tokenString);

    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        ids: [parseInt(data.shiprocketOrderId)],
      }),
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
    };

    const cancelShiprocketOrder = await fetch(
      "/api/admin/shiprocket/cancel-order",
      requestOptions
    );

    const res = await cancelShiprocketOrder.json();

    const updateOrder = await fetch(`/api/private/order/${order._id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status: "canceled",
        canceledBy: "admin",
      }),
    });

    const updateOrderData = await updateOrder.json();

    setOrders((prevOrders) => {
      return prevOrders.map((order) => {
        if (order._id === data._id) {
          return {
            ...order,
            status: updateOrderData.status,
          };
        }

        return order;
      });
    });
  };

  return (
    <Button color={"red"} variant="gradient" onClick={handleCancelOrder}>
      Cancel
    </Button>
  );
};

export default CancelOrderButton;
