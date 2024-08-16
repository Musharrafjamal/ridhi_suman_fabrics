"use client";

import React from "react";
import { Button } from "@material-tailwind/react";
import { toast } from "sonner";

const AcceptOrderButton = ({ order, setOrders }) => {
  const handleAcceptOrder = async () => {
    try {
      const fetchOrder = await fetch(`/api/private/order/${order._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await fetchOrder.json();

      const tokenString = localStorage.getItem("shiprocketToken");
      const token = JSON.parse(tokenString);

      const createdAt = new Date(data.createdAt);

      const year = createdAt.getFullYear();
      const month = String(createdAt.getMonth() + 1).padStart(2, "0");
      const day = String(createdAt.getDate()).padStart(2, "0");
      const hours = String(createdAt.getHours()).padStart(2, "0");
      const minutes = String(createdAt.getMinutes()).padStart(2, "0");

      const order_date = `${year}-${month}-${day} ${hours}:${minutes}`;

      const raw = {
        order_id: data._id,
        order_date,
        pickup_location: "Primary",
        channel_id: "",
        comment: "",
        billing_customer_name: data.shippingInfo.name.split(" ")[0],
        billing_last_name: data.shippingInfo.name.split(" ").slice(1).join(" "),
        billing_address: data.shippingInfo.address,
        billing_address_2: "",
        billing_city: data.shippingInfo.city,
        billing_pincode: Number(data.shippingInfo.pincode),
        billing_state: data.shippingInfo.state,
        billing_country: "India",
        billing_email: data.shippingInfo.email,
        billing_phone: Number(data.shippingInfo.phoneNumber),
        shipping_is_billing: false,
        shipping_customer_name: data.shippingInfo.name.split(" ")[0],
        shipping_last_name: data.shippingInfo.name
          .split(" ")
          .slice(1)
          .join(" "),
        shipping_address: data.shippingInfo.address,
        shipping_address_2: "",
        shipping_city: data.shippingInfo.city,
        shipping_pincode: Number(data.shippingInfo.pincode),
        shipping_country: "India",
        shipping_state: data.shippingInfo.state,
        shipping_email: data.shippingInfo.email,
        shipping_phone: Number(data.shippingInfo.phoneNumber),
        order_items: data.cartItems.map((item) => ({
          name: item.productId.title,
          sku: item.productId._id,
          units: Number(item.quantity),
          selling_price: Number(item.productId.price),
          discount: Number(item.productId.discount),
          tax: "",
          hsn: Math.floor(Math.random() * 10000000),
        })),
        payment_method: "Prepaid",
        shipping_charges: 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: 0,
        sub_total: Number(data.totalAmount),
        length: 30,
        breadth: 20,
        height: 10,
        weight: 1,
      };

      const requestOptions = {
        method: "POST",
        body: JSON.stringify(raw),
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
      };

      const createShiprocketOrder = await fetch(
        "/api/admin/shiprocket/create-order",
        requestOptions
      );

      const res = await createShiprocketOrder.json();

      if (!createShiprocketOrder.ok) {
        toast.error("Failed to create order on Shiprocket");
        return;
      }

      if (createShiprocketOrder.status) {
        const updateOrder = await fetch(`/api/private/order/${order._id}`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: "confirmed",
            shipment_id: res.shipment_id,
            order_id: res.order_id,
          }),
        });

        const updateOrderData = await updateOrder.json();

        if (!updateOrder.ok) {
          toast.error("Failed to update order status");
          return;
        }

        if (updateOrder.status) {
          setOrders((prevOrders) => {
            return prevOrders.map((order) => {
              if (order._id === data._id) {
                return {
                  ...order,
                  status: updateOrderData.status,
                  shipment_id: res.shipment_id,
                  order_id: res.order_id,
                };
              }

              return order;
            });
          });

          toast.success("Order accepted successfully");
        }
      }
    } catch (error) {
      toast.error("Failed to accept order. Something went wrong.", error);
    }
  };

  return (
    <Button color={"green"} variant="gradient" onClick={handleAcceptOrder}>
      Accept
    </Button>
  );
};

export default AcceptOrderButton;
