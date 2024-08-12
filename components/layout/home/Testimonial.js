"use client";

import { Carousel, IconButton } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

import Image from "next/image";

import { testimonials } from "../../../utils/testimonialData";

function Testimonial() {
  return (
    <div className="relative px-2">
      <div className="flex items-center justify-between h-full w-full absolute z-0">
        <div className="w-1/3 bg-white h-full" />
        <div className="w-4/6 ml-16 sm:bg-gray-100 h-[80%]" />
      </div>

      <div className="xl:px-20 md:px-8 px-2 py-20 2xl:mx-auto 2xl:container relative z-40">
        <div>
          <h2 className="text-4xl font-bold xl:block hidden leading-tight text-gray-800">
            <span className="text-white bg-blue-500 mr-2 rounded-full p-1">
              👍
            </span>
            Testimonial
          </h2>

          <h2 className="text-3xl font-bold xl:hidden block leading-tight lg:leading-10 text-gray-800">
            <span className="text-white bg-blue-500 mr-2 rounded-full p-1">
              👍
            </span>
            Testimonial
          </h2>

          <Carousel
            loop
            autoplay
            prevArrow={({ handlePrev }) => (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handlePrev}
                className="!absolute top-2/4 left-4 -translate-y-2/4 text-black bg-white/50 shadow rounded-full hover:bg-white/70 hover:scale-105 active:scale-100 transition-all duration-100 z-30"
              >
                <ChevronLeftIcon className="h-6 w-6 text-black" />
              </IconButton>
            )}
            nextArrow={({ handleNext }) => (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handleNext}
                className="!absolute top-2/4 !right-4 -translate-y-2/4 text-black bg-white/50 shadow rounded-full hover:bg-white/70 hover:scale-105 active:scale-100 transition-all duration-100 z-30"
              >
                <ChevronRightIcon className="h-6 w-6 text-black" />
              </IconButton>
            )}
          >
            {testimonials.map((testimonial, index) => (
              <div className="flex" key={index}>
                <div className="mt-14 md:flex">
                  <div className="relative lg:w-1/2 sm:w-96 xl:h-96 h-80">
                    <Image
                      fill
                      src={testimonial.imageSrc}
                      alt="image of profile"
                      className="w-full h-full flex-shrink-0 object-cover shadow-lg rounded object-top"
                    />

                    <div className="w-32 md:flex hidden items-center justify-center absolute top-0 -mr-16 -mt-14 right-0 h-32 bg-indigo-100 rounded-full text-">
                      <Image
                        fill
                        src="/home/testimonials/comma.svg"
                        alt="commas"
                        className="p-4"
                      />
                    </div>
                  </div>

                  <div className="md:w-1/3 lg:w-1/3 xl:ml-32 md:ml-20 md:mt-0 mt-4 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold xl:leading-loose text-gray-800">
                        {testimonial.title}
                      </h2>

                      <p className="text-base font-medium leading-6 mt-4 text-gray-600">
                        {testimonial.description}
                      </p>
                    </div>

                    <div className="md:mt-0 mt-8">
                      <p className="text-base font-medium leading-4 text-gray-800">
                        {testimonial.name}
                      </p>

                      <p className="text-base leading-4 mt-2 mb-4 text-gray-600">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
export default Testimonial;
