"use client";
import Heading from "@/components/ui/heading/Heading";
import { Button, Dialog, IconButton } from "@material-tailwind/react";
import React, { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";

const DeleteCoupon = ({ open, setOpen, coupon, setCouponCode }) => {
  const [pending, setPending] = useState(false);
  const handleOpen = () => setOpen(!open);

  const handleDelete = async () => {
    setPending(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/coupon/${coupon._id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        toast.success(`Coupon ${coupon.code} deleted successfully!`);
        setCouponCode((prev) => prev.filter((c) => c._id !== coupon._id));
        handleOpen();
      } else {
        const errorData = await res.json();
        toast.error(`Failed to delete coupon: ${errorData.message}`);
      }
    } catch (error) {
      //   console.error(error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      animate={{
        mount: { scale: 1 },
        unmount: { scale: 0 },
      }}
      className="p-6 flex flex-col gap-4"
    >
      <Heading
        icon={
          <div className="bg-gradient-to-r from-red-400 to-pink-400 p-1 rounded-full inline-block">
            <FaRegTrashCan size={20} color="white" />
          </div>
        }
        title={"Delete"}
        buttons={[
          <IconButton key={1} variant="text" onClick={handleOpen}>
            <RxCross1 size={20} />
          </IconButton>,
        ]}
      />
      <div className="flex items-center gap-1 bg-red-50 text-red-700 px-4 py-1 my-4 rounded-md">
        <div className="flex gap-1">
          <MdOutlineError size={25} />
          <span>
            Are you sure you want to delete this Coupon{" "}
            <span className="font-bold">{coupon.code}</span>?
          </span>
        </div>
      </div>
      <div className="flex justify-end items-center gap-4">
        <Button
          variant="outlined"
          size="sm"
          className="rounded"
          color="red"
          onClick={handleOpen}
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="gradient"
          size="sm"
          className="rounded"
          color="red"
          type="submit"
          onClick={handleDelete}
          loading={pending ? true : false}
        >
          Delete
        </Button>
      </div>
    </Dialog>
  );
};

export default DeleteCoupon;
