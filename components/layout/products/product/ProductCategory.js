import Link from "next/link";
import { CiDiscount1 } from "react-icons/ci";

const ProductCategory = ({ category, discount, subCategory }) => {
  return (
    <div className="pb-3 pt-6 px-2 flex items-center justify-between z-30 bg-white relative gap-2">
      <Link href={`/category/${category}/${subCategory.name}`}>
        <h3
          style={{ background: subCategory.colour }}
          className="font-medium text-black py-0.5 max-w-44 rounded-md px-4 text-sm capitalize truncate"
        >
          {category} / {subCategory.name}
        </h3>
      </Link>

      <div className="flex gap-1 items-center text-nowrap">
        <CiDiscount1 className="text-red-500 w-5 h-5" />

        <p className="text-red-500">
          <span className="">{discount}%</span>{" "}
          <span className="text-xs">OFF</span>
        </p>
      </div>
    </div>
  );
};

export default ProductCategory;
