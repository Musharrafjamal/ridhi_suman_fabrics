"use client";
import { Suspense, useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  CardBody,
  Chip,
  Avatar,
  CardFooter,
  Select,
  Option,
  CardHeader,
} from "@material-tailwind/react";
import { IoIosRefresh } from "react-icons/io";
import Heading from "@/components/ui/heading/Heading";
import DefaultBtn from "@/components/ui/buttons/DefaultBtn";
import { RiCoupon4Line } from "react-icons/ri";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import PaginationBtn from "@/components/ui/PaginationBtn";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";
import AcceptOrder from "@/components/layout/admin/orders/AcceptOrder";

const statusColors = {
  confirmed: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  delivered: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
};

const AdminOrders = () => {
  const searchParams = useSearchParams();

  const [meta, setMeta] = useState({});
  const [orders, setOrders] = useState([]);

  const currentPage = searchParams.get("page");

  const handleStatusChange = async (id, field, newStatus) => {
    try {
      const res = await fetch(`/api/private/order/${id}`, {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrders((prevOrders) => {
          return prevOrders.map((order) => {
            if (order._id === id) {
              if (field === "isPaid") {
                return { ...order, isPaid: data.isPaid };
              } else if (field === "status") {
                return { ...order, status: data.status };
              }
            }
            return order;
          });
        });

        toast.success("Status updated successfully");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status", error);
    }
  };

  const getOrders = async (page) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/order?page=${page}size=15`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const data = await res.json();

      setOrders(data.data);
      setMeta(data.pagination);
    } catch (e) {
      toast.error("Failed to fetch Orders", e);
    }
  };

  useEffect(() => {
    getOrders(currentPage);
  }, [currentPage]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };

    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const btns = [
    <DefaultBtn
      key={1}
      icon={<IoIosRefresh />}
      title={"Refresh"}
      clickHandler={() => {
        getOrders(currentPage);
      }}
    />,
  ];

  if (orders.length === 0) {
    return (
      <div className="w-full flex gap-1 justify-center items-center my-10 text-2xl text-pink-500">
        <AiOutlineLoading className="animate-spin" />
      </div>
    );
  }

  return (
    <Card className="h-full w-full shadow-none">
      <CardHeader className="py-3 shadow-none mt-2">
        <Heading
          icon={
            <div className="bg-gradient-to-r from-red-400 to-pink-400 p-1 rounded-full inline-block">
              <RiCoupon4Line size={20} color="white" />
            </div>
          }
          title={"Order Details"}
          buttons={btns}
        />
      </CardHeader>

      <CardBody className="p-2 mx-8  overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="py-4 w-auto">Order By</th>
              <th className="w-auto">Amount</th>
              <th className="w-auto">Order Date</th>
              <th className="w-auto">Status</th>
              <th className="w-auto">Order Select</th>
              <th className="w-auto">Action</th>
              <th className="w-auto">Accept Order</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => {
              const isLast = index === orders.length - 1;
              const classes = isLast ? "p-2" : "p-2 border-b border-gray-200";

              return (
                <tr key={order._id} className="text-center hover:bg-gray-50">
                  <td className={`${classes}  px-0 w-60 pl-5`}>
                    <div className="flex items-center gap-3">
                      {order.user &&
                      order.user.image &&
                      order.user.image.url ? (
                        <Avatar
                          src={order.user.image.url}
                          alt="image"
                          size="sm"
                        />
                      ) : (
                        <Avatar alt="image" size="sm" />
                      )}
                      <div className="flex flex-col items-start">
                        <div className="font-bold capitalize">
                          {order.user ? order.user.name : "N/A"}
                        </div>
                        <div className="text-sm opacity-50">
                          {order.user ? order.user.phoneNumber : "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      &#8377;{parseFloat(order.totalAmount).toFixed(2)}
                    </Typography>
                  </td>

                  <td className={`${classes} px-5`}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {formatDate(order.createdAt)}
                    </Typography>
                  </td>

                  <td className={classes}>
                    <Chip
                      size="sm"
                      variant="ghost"
                      value={order.status}
                      className={`${
                        statusColors[order.status]
                      } py-2 px-0 text-center rounded-full`}
                    />
                  </td>

                  <td className={`${classes} w-32`}>
                    <Select
                      label="Select status"
                      color="blue"
                      className=""
                      value={order.status}
                      onChange={(value) =>
                        handleStatusChange(order._id, "status", value)
                      }
                    >
                      <Option value="confirmed">Confirmed</Option>
                      <Option value="pending" disabled>
                        Pending
                      </Option>
                      <Option
                        value="delivered"
                        disabled={order.status === "canceled"}
                      >
                        Delivered
                      </Option>
                      <Option value="canceled" disabled>
                        Canceled
                      </Option>
                    </Select>
                  </td>

                  <td className={classes}>
                    <Link href={`/admin/orders/${order._id}`}>
                      <Button variant="outlined" color="blue">
                        View
                      </Button>
                    </Link>
                  </td>

                  <AcceptOrder order={order} setOrders={setOrders} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>

      <CardFooter>
        <PaginationBtn totalPages={meta.totalPages} />
      </CardFooter>
    </Card>
  );
};

const Page = () => {
  return (
    <Suspense>
      <AdminOrders />
    </Suspense>
  );
};

export default Page;
