"use client";

import { RxCross1 } from "react-icons/rx";
import { Button, Dialog, IconButton } from "@material-tailwind/react";

import { toast } from "sonner";

import Heading from "@/components/ui/heading/Heading";
import { TicketIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ListOfCoupon = ({ open, setOpen, setTotalAmount }) => {
  const handleOpen = () => setOpen(!open);
  const [couponList, setCouponList] = useState([]);
  const dispatch = useDispatch();
  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/coupon");
      const data = await response.json();
      setCouponList(data);
    } catch (error) {
      toast.error("Error fetching coupons");
    }
  };
  const cart = useSelector((state) => state.cart);
  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleApplyCoupon = (coupon) => {
    if (cart.items.length === 0) {
      toast.error("No items in cart");
      return;
    }

    if (cart.totalPrice < parseInt(coupon.minAmt)) {
      toast.error(
        `Total cart value should be at least ₹${parseInt(coupon.minAmt)}`
      );
      return;
    }

    // Calculate the discount amount
    let discountAmount =
      (parseInt(coupon.discount) / 100) * parseInt(cart.totalPrice);

    // Ensure the discount does not exceed the maximum amount allowed by the coupon
    if (discountAmount > parseInt(coupon.maxAmt)) {
      discountAmount = parseInt(coupon.maxAmt);
    }

    // Calculate the new total amount after applying the coupon
    let couponAppliedAmount = cart.totalPrice - discountAmount;
    setTotalAmount(couponAppliedAmount);
    // dispatch(
    //   updateCart({
    //     totalPrice: couponAppliedAmount,
    //   })
    // );
    handleOpen();
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="sm"
      animate={{
        mount: { scale: 1 },
        unmount: { scale: 0 },
      }}
      className="p-6 flex flex-col gap-4"
    >
      <Heading
        icon={
          <div className="bg-gradient-to-r from-red-400 to-pink-400 p-1 rounded-full inline-block">
            <TicketIcon className="h-5 w-5 text-white" />
          </div>
        }
        title={"Available coupons"}
        buttons={[
          <IconButton variant="text" onClick={handleOpen} key={"cross-key"}>
            <RxCross1 size={20} />
          </IconButton>,
        ]}
      />
      <div className="flex flex-col gap-2">
        {couponList.map((coupon) => (
          <div
            key={coupon._id}
            className="flex items-center justify-between border border-gray-500 px-4 py-2 rounded-md"
          >
            <div className="flex flex-col justify-between gap-1">
              <div className="flex gap-2 items-center">
                <p className="font-bold text-gray-700 uppercase">
                  {coupon.code}
                </p>
                <p className="text-gray-700">{coupon.discount}% off</p>
              </div>
              <div className="flex gap-1 items-center">
                <p className="text-xs text-pink-500">
                  {cart.totalPrice < coupon.minAmt ? (
                    <span>
                      Purchase ₹{coupon.minAmt - cart.totalPrice} to get this
                      coupon!
                    </span>
                  ) : (
                    <span>Min spent ₹{coupon.minAmt}</span>
                  )}
                </p> |
                <p className="text-sm text-teal-700">
                  Up to ₹{coupon.maxAmt}
                </p>
              </div>
            </div>
            <Button
              variant="outlined"
              size="sm"
              color="pink"
              className="rounded h-fit"
              disabled={cart.totalPrice < coupon.minAmt}
              onClick={() => handleApplyCoupon(coupon)}
            >
              Apply code
            </Button>
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export default ListOfCoupon;
