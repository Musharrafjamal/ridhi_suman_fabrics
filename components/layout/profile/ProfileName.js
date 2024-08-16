import { Typography } from "@material-tailwind/react";
import { PencilIcon, CheckIcon } from "@heroicons/react/24/solid";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

const ProfileName = ({ session }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    const updatedName = username.trim();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedName }),
      });

      if (res.ok) {
        const data = await res.json();
        setUsername(data.name);
        session.user.name = data.name;
      } else {
        toast.error("Failed to update name");
      }
    } catch (error) {
      toast.error(error.message || error.error || "Failed to update name");
    }
  };

  const handleOutsideClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      handleSaveClick();
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isEditing]);

  return (
    <div className="flex items-center justify-center">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border-b border-blue-gray-500 focus:outline-none"
        />
      ) : (
        <Typography variant="h4" color="blue-gray" className="capitalize">
          {session?.user?.name}
        </Typography>
      )}
      <button
        onClick={isEditing ? handleSaveClick : handleEditClick}
        className="ml-2"
      >
        {isEditing ? (
          <CheckIcon className="h-5 w-5 text-blue-gray-500" />
        ) : (
          <PencilIcon className="h-5 w-5 text-blue-gray-500" />
        )}
      </button>
    </div>
  );
};

export default ProfileName;
