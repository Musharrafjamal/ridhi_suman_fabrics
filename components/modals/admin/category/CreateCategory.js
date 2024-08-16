"use client";
import { HiOutlineUpload } from "react-icons/hi";
import Image from "next/image";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  Dialog,
  IconButton,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import { RxCross1 } from "react-icons/rx";
import { useState } from "react";
import Heading from "@/components/ui/heading/Heading";
import { FaTshirt } from "react-icons/fa";
import colours from "@/libs/colours";
import { toast } from "sonner";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";

const CreateCategory = ({ open, setOpen, setCategories }) => {
  const handleOpen = () => setOpen(!open);

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    subCategories: [],
  });
  const [subCategory, setSubCategory] = useState({
    name: "",
    colour: "",
  });
  const [pending, setPending] = useState(false);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({
        ...formData,
        image: event.target.files[0],
      });
    }
  };

  const handleCreateCategory = async (e) => {
    try {
      e.preventDefault();
      if (!formData.image) {
        toast.warning("Category Image is required");
        return;
      }
      if (!formData.name) {
        toast.warning("Category name is required");
        return;
      }
      setPending(true);

      const imageRef = ref(
        storage,
        `categories/${formData.image.size + formData.image.name}`
      );
      await uploadBytes(imageRef, formData.image);
      const imageUrl = await getDownloadURL(imageRef);

      const imageObject = { url: imageUrl, name: imageRef._location.path_ };

      const postData = { ...formData, image: imageObject };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (res.ok) {
        const responseData = await res.json(); // Assuming the response is JSON
        toast.success(`Created ${formData.name} category`);
        handleOpen();
        setFormData({
          name: "",
          image: null,
          subCategories: [],
        });
        setCategories((prev) => {
          return [...prev, responseData];
        });
      } else {
        const errorData = await res.json();
        toast.error(`Error creating category: ${errorData.message}`);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, x: 0 },
          unmount: { scale: 0, x: 600 },
        }}
        className="p-6"
      >
        <Heading
          icon={
            <div className="bg-gradient-to-r from-red-400 to-pink-400 p-1 rounded-full inline-block">
              <FaTshirt size={20} color="white" />
            </div>
          }
          title={"Create categories"}
          buttons={[
            <IconButton key={1} variant="text" onClick={handleOpen}>
              <RxCross1 size={20} />
            </IconButton>,
          ]}
        />
        <form
          className="flex flex-col gap-4 mt-4"
          onSubmit={handleCreateCategory}
        >
          <div className="flex flex-col items-center">
            <label
              htmlFor="profile"
              className="cursor-pointer flex items-center space-x-4 border rounded-md p-4 w-full"
            >
              {formData.image ? (
                <div className="relative w-12 h-12">
                  <Image
                    src={URL.createObjectURL(formData.image)}
                    alt="avatar"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
              <div className="flex-grow pl-2">
                <p className="text-gray-500">Category Image</p>
                <p className="text-sm text-gray-400">PNG or JPG</p>
              </div>
              <div className="ml-auto">
                <HiOutlineUpload className="w-6 h-6 text-gray-500" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              name="profile"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <Input
            label="Category name"
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => {
                return { ...prev, name: e.target.value };
              });
            }}
          />
          <div className="flex flex-col lg:flex-row gap-2 items-center justify-center">
            <Input
              label="Sub category"
              value={subCategory.name}
              onChange={(e) => {
                setSubCategory((prev) => {
                  return { ...prev, name: e.target.value };
                });
              }}
            />
            <div className="flex gap-2 items-center justify-center w-full">
              <Select
                label="Choose a colour"
                value={subCategory.colour}
                onChange={(e) => {
                  setSubCategory((prev) => {
                    return { ...prev, colour: e };
                  });
                }}
              >
                {colours.map((color) => {
                  return (
                    <Option key={color.name} value={color.hex}>
                      <div className="flex items-center gap-2">
                        <div
                          style={{ background: color.hex }}
                          className="w-4 h-4 rounded-lg"
                        ></div>
                        {color.name}
                      </div>
                    </Option>
                  );
                })}
              </Select>
              <div
                className="cursor-pointer"
                onClick={() => {
                  if (!subCategory.colour && !subCategory.name) {
                    return;
                  }
                  setFormData((prev) => {
                    return {
                      ...prev,
                      subCategories: [...prev.subCategories, subCategory],
                    };
                  });
                  setSubCategory({ name: "", colour: "" });
                }}
              >
                <IoIosAddCircleOutline size={35} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {formData.subCategories.map((category) => {
              return (
                <div
                  key={category.name}
                  style={{ border: `2px solid ${category.colour}` }}
                  className={`w-fit flex gap-2 items-center justify-between p-1.5 h-full rounded-md`}
                >
                  <div className="flex gap-1 items-center text-xs">
                    <div
                      style={{ background: category.colour }}
                      className="w-3 h-3 rounded-lg"
                    ></div>
                    {category.name}
                  </div>
                  <button
                    onClick={() => {
                      setFormData((prev) => {
                        return {
                          ...prev,
                          subCategories: prev.subCategories.filter(
                            (c) => c.name !== category.name
                          ),
                        };
                      });
                    }}
                  >
                    <RxCross1 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end items-center gap-4">
            <Button variant="outlined" color="blue" onClick={handleOpen}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              color="blue"
              disabled={pending}
              type="submit"
            >
              {pending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default CreateCategory;
