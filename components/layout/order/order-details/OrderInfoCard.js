"use client";
import Heading from "@/components/ui/heading/Heading";
import { Button } from "@material-tailwind/react";
import React, { useState } from "react";
import DataCard from "./DataCard";
import { CiCalendarDate, CiCircleInfo } from "react-icons/ci";
import { RiPriceTag2Line, RiSecurePaymentLine } from "react-icons/ri";
import { TiCancelOutline } from "react-icons/ti";
import { TbMessageCancel } from "react-icons/tb";
import { IoPricetagOutline } from "react-icons/io5";
import { PiContactlessPaymentLight } from "react-icons/pi";
import CancelOrder from "./CancelOrder";
import { MdInfoOutline } from "react-icons/md";
import { useSession } from "next-auth/react";
import { IoMdCall } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const OrderInfoCard = ({ data, setData }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { data: session } = useSession();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderButtons = () => {
    switch (data.status) {
      case "pending":
        return (
          <>
            {session.user.role === "admin" && (
              <Button
                variant="outlined"
                className="text-red-500 border-red-500 w-fit py-2 px-3"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Cancel Order
              </Button>
            )}
            {session.user.role === "admin" && data.isPaid ? (
              <Button className="text-white bg-green-500 w-fit py-2 px-4 ml-5">
                Accept
              </Button>
            ) : (
              ""
            )}
          </>
        );
      case "confirmed":
        return (
          <>
            {session.user.role === "admin" && (
              <Button
                variant="outlined"
                className="text-red-500 border-red-500 w-fit py-2 px-3"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Cancel Order
              </Button>
            )}
            <Button className="text-white bg-blue-500 w-fit py-2 px-3 ml-2">
              Track Order
            </Button>
          </>
        );
      case "delivered":
        return (
          <Button className="text-white bg-blue-500 w-fit py-2 px-3">
            Track Order
          </Button>
        );
      default:
        return null;
    }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2 p-2">
        <DataCard
          icon={<CiCalendarDate size={20} />}
          title="Order Date"
          data={formatDate(data.createdAt)}
        />
        <DataCard
          icon={<IoPricetagOutline size={20} />}
          title="Payment Method"
          data={data.paymentMethod}
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
      <div className="ml-2">{renderButtons()}</div>
      {session.user.role === "user" && (
        <div className="flex flex-col gap-3 ml-2">
          <p className="text-gray-500">
            Contact us for any enquiry, we are available to serve you 24/7
          </p>
          <div className="flex gap-5 relative">
            <Link href={"/contactUs"}>
              <Button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                variant="outlined"
                className=" text-[#11998E] border-[#11998E] shadow-none w-fit flex gap-1 items-center py-2 px-3"
              >
                <IoMdCall size={18} />
                Call us
              </Button>
              {showTooltip && (
                <div className="w-32 text-center absolute left-28 top-0 bg-white text-gray-800 text-xs rounded py-1 px-2 border z-50">
                  +91 8000400004
                </div>
              )}
            </Link>
            <Button
              className="text-white bg-[#11998E] border-[#11998E] w-fit gap-1 flex relative items-center px-3 md:px-6 py-2"
              onClick={() =>
                window.open("https://wa.me/918000400004", "_blank")
              }
            >
              <FaWhatsapp className=" text-sm md:text-base" />
              Chat on whatsapp
            </Button>
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
