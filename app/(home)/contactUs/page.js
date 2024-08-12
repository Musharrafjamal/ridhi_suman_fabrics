"use client";
import Link from "next/link";
import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { IoMailSharp } from "react-icons/io5";

const page = () => {
  return (
    <section className="p-6 text-gray-700">
      <div className="text-center">
        <h2 className="text-red-600 text-2xl font-semibold">
          Contact Information
        </h2>
        <p className="mt-2 text-gray-600">
          Write to us or call us, get quick response powered by our advanced
          customer support team.
        </p>
      </div>

      <div className="mt-6 space-y-4 w-7/12 mx-auto pl-8">
        <div className="flex items-center">
          <FaMapMarkerAlt className="text-red-600 text-xl mr-4" />
          <div>
            <p className="font-semibold">Ridhi Suman Fabrics</p>
            <p>
              G-1, Ground Floor, Surana 101, Sahara Darwaja, Ring Road, Surat,
              Gujarat - 395002
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <FaPhoneAlt className="text-red-600 text-xl mr-4" />
          <div>
            <p>
              Call: <span className="font-semibold">+91-800-040-0004</span>
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <IoMailSharp className="text-red-600 text-xl mr-4" />
          <div>
            <p>
              Mail: <span className="font-semibold">ridhisuman@gmail.com</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-red-600 text-lg font-semibold">FOLLOW US !!</h3>
        <div className="flex justify-center mt-4 space-x-4">
          <Link href="#" className="text-red-600 text-2xl hover:text-red-700">
            <FaYoutube />
          </Link>
          <Link href="#" className="text-red-600 text-2xl hover:text-red-700">
            <FaFacebook />
          </Link>
          <Link href="#" className="text-red-600 text-2xl hover:text-red-700">
            <FaInstagram />
          </Link>
          <Link href="#" className="text-red-600 text-2xl hover:text-red-700">
            <FaLinkedin />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default page;
