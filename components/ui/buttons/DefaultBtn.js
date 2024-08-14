import React from "react";

const DefaultBtn = ({ icon, title, clickHandler, type = "button" }) => {
  return (
    <button
      key={title}
      type={type}
      className={`w-full justify-center flex items-center gap-1 px-4 py-2 cursor-pointer rounded-md bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-md shadow-pink-100 hover:scale-95 transition-all duration-500 text-xs lg:text-sm`}
      onClick={clickHandler}
    >
      {title} {icon && icon}
    </button>
  );
};

export default DefaultBtn;
