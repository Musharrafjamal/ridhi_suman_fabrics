import Image from "next/image";

import { bannerData } from "@/utils/HomePageData";

const HomeBanner = () => {
  return (
    <div className="flex w-full px-2 -my-8 mb-5 sm:mb-2 sm:my-0">
      {bannerData.slice(0, 3).map((banner, index) => (
        <div
          className={`relative h-80 ${
            index === 0
              ? "w-full md:w-1/2 xl:w-1/3"
              : index === 1
              ? "hidden sm:block md:w-1/2 xl:w-1/3"
              : "hidden lg:block xl:w-1/3"
          }`}
          key={index}
        >
          <Image
            src={banner.src}
            alt={banner.alt}
            fill
            style={{ objectFit: "contain", objectPosition: "center" }}
          />
        </div>
      ))}
    </div>
  );
};

export default HomeBanner;
