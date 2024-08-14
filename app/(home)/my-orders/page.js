"use client";
import OrderCard from "@/components/layout/home/orders/OrderCard";
import PaginationBtn from "@/components/ui/PaginationBtn";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "sonner";
import { BsEmojiDizzy } from "react-icons/bs";

const MyOrders = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({});
  const searchParams = useSearchParams();

  const page = searchParams.get("page");

  useEffect(() => {
    if (session) {
      const fetchOrders = async () => {
        try {
          const response = await fetch(`/api/user/orders?page=${page}`, {
            method: "GET",
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const ordersData = await response.json();

          setOrders(ordersData.data);
          setMeta(ordersData.meta);
        } catch (err) {
          toast.error(err.message);
        }
      };

      fetchOrders();
    }
  }, [session, page]);

  if (status === "loading") {
    return (
      <div className="w-full flex gap-1 justify-center items-center my-48 text-2xl text-pink-500">
        <AiOutlineLoading className="animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full flex gap-1 justify-center items-center my-10 text-2xl text-pink-500">
        Please log in to access this page.
      </div>
    );
  }

  return (
    <>
      <div className="w-full text-center text-3xl font-aclonica flex justify-center mt-4 gap-2 text-gray-700">
        Welcome, <div className="text-blue-500">{session.user.name}</div>
      </div>

      {orders.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mx-10 place-items-center">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
          <div className="mt-5">
            <PaginationBtn totalPages={meta.totalPages} />
          </div>
        </div>
      ) : (
        <div className="w-full flex gap-1 justify-center items-center my-10 text-2xl text-pink-500">
          {" "}
          <BsEmojiDizzy /> No orders found.
        </div>
      )}
    </>
  );
};

const Page = () => {
  return (
    <Suspense>
      <MyOrders />
    </Suspense>
  );
};

export default Page;
