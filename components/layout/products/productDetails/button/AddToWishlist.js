import { addToWishlist, removeFromWishlist } from "@/redux/slice/wishlistSlice";
import { HeartIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const AddToWishlist = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();

  const [isAnimating, setIsAnimating] = useState(false);

  const wishlist = useSelector((state) => state.wishlist.items);

  const isInWishlist = wishlist ? wishlist.includes(productId) : false;

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      if (wishlist === "Unauthorized Access") {
        toast.error("Please log in to add to wishlist");
        return;
      }

      setIsAnimating(true);

      const action = isInWishlist ? "remove" : "add";

      setTimeout(async () => {
        setIsAnimating(false);
      }, 300);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/wishlist`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, action }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (action === "add") {
          dispatch(addToWishlist(productId));
        } else {
          dispatch(removeFromWishlist(productId));
        }

        toast.success(
          `Product ${action === "add" ? "added to" : "removed from"} wishlist.`
        );
      } else {
        toast.error(data || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || error.data || error || "Something went wrong"
      );
    }
  };

  return (
    <Button
      color="white"
      className={`flex items-center gap-1 cursor-pointer p-1 bg-transparent hover:shadow-none shadow-none w-fit group transition-all`}
      onClick={handleWishlistToggle}
    >
      <HeartIcon
        className={`w-5 h-5 text-pink-500 ${
          isAnimating ? "wishlist-animation-in" : ""
        } ${
          isInWishlist
            ? "fill-pink-500 group-hover:fill-transparent"
            : "group-hover:fill-pink-500"
        }`}
      />
      {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  );
};

export default AddToWishlist;
