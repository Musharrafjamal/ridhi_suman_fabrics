// components/ShippingInfoCard.js
"use client";
import Heading from "@/components/ui/heading/Heading";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { BiMap, BiMapPin, BiBuilding } from "react-icons/bi";
import DataCard from "./DataCard";
import { FaRegUser } from "react-icons/fa6";
import { UserIcon } from "@heroicons/react/24/outline";

const UserInfoCard = ({ data }) => {
  return (
    <div className="rounded-lg flex flex-col gap-5 border-2 border-gray-500 w-full p-4">
      <Heading
        icon={
          <div className="inline-block pr-1 font-bold">
            <FaRegUser size={25} color="red" />
          </div>
        }
        title={"USER INFORMATION"}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2 p-2">
        <DataCard
          icon={<UserIcon className="w-5 h-5" />}
          title="FullName"
          data={data.name}
        />
        <DataCard
          icon={<AiOutlinePhone size={20} className="rotate-90" />}
          title="Phone Number"
          data={data.phoneNumber}
        />
        <DataCard
          icon={<AiOutlineMail size={20} />}
          title="Email"
          data={data.email}
        />
        <DataCard
          icon={<BiBuilding size={20} />}
          title="City"
          data={data.city}
        />
        <DataCard
          icon={<BiMapPin size={20} />}
          title="State"
          data={data.state}
        />
        <DataCard
          icon={<BiMapPin size={20} />}
          title="Pincode"
          data={data.pincode}
        />

        <div className="col-span-1 sm:col-span-2 flex items-start">
          <DataCard
            icon={<BiMap size={20} />}
            title="Delivery Address"
            data={data.address}
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
