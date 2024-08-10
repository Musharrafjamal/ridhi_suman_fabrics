"use client";

import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "sonner";

const PaymentStatusPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { MTID } = useParams();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    if (!MTID) return;
    try {
      const response = await fetch(
        `/api/private/payments/check-status/${MTID}?orderId=${orderId}`,
        { cache: "no-store" }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPaymentStatus(true);
        } else {
          setPaymentStatus(false);
        }
      } else {
        throw new Error();
      }
    } catch (error) {
      setPaymentStatus(false);
      toast.error("Invalid Transaction Id");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [MTID]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-48">
        <AiOutlineLoading className="animate-spin text-pink-500" size={50} />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-48 bg-gray-100">
      {paymentStatus ? (
        <div className="p-6 bg-white rounded-lg shadow-lg text-center">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Your transaction has been completed successfully.
          </p>
          <Link href={`/my-orders/${orderId}`}>
            <Button variant="gradient" color="teal">
              Check order
            </Button>
          </Link>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-lg shadow-lg text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Payment Unsuccessful
          </h2>
          <p className="text-gray-600 mb-4">
            There was an issue with your transaction. Please try again.
          </p>
          <div className="flex items-center gap-2 justify-center">
            <Link href={`/`}>
              <Button variant="gradient" color="pink">
                Home
              </Button>
            </Link>
            <Button
              onClick={() => window.location.reload()}
              variant="gradient"
              color="teal"
            >
              Refresh
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatusPage;
