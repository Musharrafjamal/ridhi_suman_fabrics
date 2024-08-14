"use client";
import Heading from "@/components/ui/heading/Heading";
import { Button } from "@material-tailwind/react";
import React, { useState } from "react";
import DataCard from "./DataCard";
import { CiCalendarDate } from "react-icons/ci";
import { RiPriceTag2Line } from "react-icons/ri";
import { TiCancelOutline } from "react-icons/ti";
import { IoPricetagOutline } from "react-icons/io5";
import { PiContactlessPaymentLight, PiPathFill } from "react-icons/pi";
import CancelOrder from "./CancelOrder";
import { MdInfoOutline } from "react-icons/md";
import { useSession } from "next-auth/react";
import { IoMdCall } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import Link from "next/link";
import TooltipFooter from "@/components/ui/Tooltip";

const OrderInfoCard = ({ data, setData }) => {
  const { data: session } = useSession();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="rounded-lg flex flex-col gap-4 border-2 border-gray-500 w-full p-4">
      <Heading
        icon={
          <div className="inline-block pr-1 font-bold">
            <MdInfoOutline size={25} color="red" />
          </div>
        }
        title={"ORDER INFORMATION"}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 p-2">
        <DataCard
          icon={<IoPricetagOutline size={20} />}
          title="Order Id"
          data={
            data.shiprocketOrderId ? (
              data?.shiprocketOrderId
            ) : (
              <span>Order not confirmed yet</span>
            )
          }
        />
        <DataCard
          icon={<CiCalendarDate size={20} />}
          title="Order Date"
          data={formatDate(data.createdAt)}
        />
        <DataCard
          icon={<RiPriceTag2Line size={20} />}
          title="Payment Status"
          data={data.isPaid ? "Paid" : "UnPaid"}
        />
        <DataCard
          icon={<PiContactlessPaymentLight size={20} />}
          title="Status"
          data={data.status}
        />
        {data.status === "canceled" && (
          <DataCard
            icon={<TiCancelOutline size={20} />}
            title="Cancel By"
            data={data.canceledBy}
          />
        )}
        {data.status === "canceled" && (
          <DataCard
            icon={<TiCancelOutline size={20} />}
            title="Cancellation Reason"
            data={data.cancellationReason}
          />
        )}
      </div>
      {!data.isPaid && (
        <div className="border-l-2 border-pink-500 text-gray-700 pl-4 pb-1 ml-2">
          <h2 className="flex items-center gap-2 font-semibold text-lg mb-2 text-pink-700">
            <GoAlertFill />
            Payment failed!
          </h2>

          <ul className="list-disc ml-4 space-y-2">
            {data.transactionId && (
              <li className="text-sm">
                Payment transaction id: {data.transactionId}
              </li>
            )}
            <li className="text-sm">
              Refundable amount will be credited within 2-3 business days!
            </li>
          </ul>
        </div>
      )}
      {session.user.role === "user" && (
        <div className="flex flex-col gap-3 ml-2">
          <p className="text-gray-500">
            Contact us for any enquiry, we are available to serve you 24/7
          </p>
          <div className="flex gap-4 flex-col md:flex-row">
            {(data.status === "confirmed" || data.status === "delivered") && (
              <Link
                target="_blank"
                href={`https://www.shiprocket.in/shipment-tracking/`}
              >
                <Button
                  variant="gradient"
                  color="pink"
                  className="flex items-center gap-1 w-full justify-center md:w-fit h-full"
                  size="sm"
                >
                  <PiPathFill size={18} />
                  Track order
                </Button>
              </Link>
            )}

            <TooltipFooter label="+91 8000400004">
              <Link href={"/contactUs"}>
                <Button
                  variant="outlined"
                  size="sm"
                  className="w-full  text-[#11998E] border-[#11998E] flex gap-1 items-center justify-center whitespace-nowrap"
                >
                  <IoMdCall size={18} />
                  Call us
                </Button>
              </Link>
            </TooltipFooter>
            <Link href={"https://wa.me/918000400004"} target="_blank">
              <Button
                className="w-full text-white bg-[#11998E] border-[#11998E] gap-1 justify-center flex whitespace-nowrap items-center"
                size="sm"
              >
                <FaWhatsapp size={20} />
                Chat on whatsapp
              </Button>
            </Link>
          </div>
        </div>
      )}
      <CancelOrder
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        id={data._id}
        setData={setData}
      />
    </div>
  );
};

export default OrderInfoCard;
