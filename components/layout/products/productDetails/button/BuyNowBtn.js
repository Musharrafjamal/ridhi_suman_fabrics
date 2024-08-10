import { Button } from "@material-tailwind/react";

import React from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { addItemToCart, updateCart } from "@/redux/slice/cartSlice";

const BuyNowBtn = ({
  price,
  discount,
  productColor,
  productSize,
  productHex,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { productId } = useParams();

  const cart = useSelector((state) => state.cart);

  const handleButtonClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (productColor === null || productSize === null) {
      toast.warning("Please select product size and color");
      return;
    }

    const product = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/cart`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          color: {
            name: productColor,
            hex: productHex,
          },
          size: productSize,
        }),
      }
    );

    const data = await product.json();

    if (product.ok) {
      router.push("/checkout");

      if (cart.totalQuantity === 0) {
        dispatch(addItemToCart(data));

        dispatch(
          updateCart({
            totalQuantity: 1,
            totalPrice: Number((price - (discount / 100) * price).toFixed(2)),
          })
        );

        toast.success("Product added to cart.");
      }
    } else {
      toast.error(data.message || data.error || data);
    }
  };

  return (
    <Button
      fullWidth
      variant="gradient"
      color="teal"
      className="w-full h-full rounded"
      size="md"
      onClick={handleButtonClick}
    >
      Buy Now
    </Button>
  );
};

export default BuyNowBtn;
