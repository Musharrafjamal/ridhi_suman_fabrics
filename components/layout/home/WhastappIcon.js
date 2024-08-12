"use client";
import React, { useState } from "react";
import { BsWhatsapp } from "react-icons/bs";

const WhastappIcon = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="fixed left-5 bottom-5  md:left-10 md:bottom-12  z-50"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center hover:cursor-pointer"
        onClick={() => window.open("https://wa.me/918000400004", "_blank")}
      >
        <BsWhatsapp color="white" className="text-xl" />
      </div>
      {showTooltip && (
        <div className="w-28 text-center absolute left-12 bottom-3 bg-white text-gray-800 text-xs rounded py-1 px-2 border">
          WhatsApp Now
        </div>
      )}
    </div>
  );
};

export default WhastappIcon;
