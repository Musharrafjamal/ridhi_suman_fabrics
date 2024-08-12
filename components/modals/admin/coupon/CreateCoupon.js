"use client";
import React, { useState } from "react";
import Heading from "@/components/ui/heading/Heading";
import { Button, Dialog, IconButton, Input } from "@material-tailwind/react";
import { RiCoupon4Line } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";

const CreateCoupon = ({ open, setOpen, setCouponCode }) => {
  const [pending, setPending] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    minAmt: "",
    maxAmt: "",
  });
  const handleOpen = () => {
    setOpen(!open);
    setFormData({ code: "", discount: "", minAmt: "", maxAmt: "" });
  };

  const handleNumChange = (e) => {
    const { name, value } = e.target;
    const isValid = /^\d*$/.test(value);
    if (isValid) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      toast.error("Please enter digits only");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/coupon`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const resData = await res.json();
      if (res.ok) {
        toast.success("Coupon Created Sucessfully");
        setCouponCode((prevCoupons) => [...prevCoupons, resData]);
        handleOpen();
      } else {
        toast.error(resData);
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      animate={{
        mount: { scale: 1, x: 0 },
        unmount: { scale: 0, x: 600 },
      }}
      className="p-6"
    >
      <Heading
        icon={
          <div className="bg-gradient-to-r from-red-400 to-pink-400 p-1 rounded-full inline-block">
            <RiCoupon4Line size={20} color="white" />
          </div>
        }
        title={"Create Coupon"}
        buttons={[
          <IconButton key={1} variant="text" onClick={handleOpen}>
            <RxCross1 size={20} />
          </IconButton>,
        ]}
      />
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4"
      >
        <Input
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
        />
        <Input
          label="Discount(%)"
          name="discount"
          value={formData.discount}
          maxLength={2}
          onChange={handleNumChange}
          required
        />
        <Input
          label="Minimum Amount"
          name="minAmt"
          value={formData.minAmt}
          onChange={handleNumChange}
          required
        />
        <Input
          label="Maximum Discount Amount"
          name="maxAmt"
          value={formData.maxAmt}
          onChange={handleNumChange}
          required
        />
        <div className="flex justify-end items-center gap-4 col-span-full">
          <Button variant="outlined" color="blue" onClick={handleOpen}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="blue"
            type="submit"
            loading={pending ? true : false}
          >
            Create
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateCoupon;
