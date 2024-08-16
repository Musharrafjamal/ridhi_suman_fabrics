"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaTshirt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import Heading from "@/components/ui/heading/Heading";
import {
  FolderMinusIcon,
  ArrowUpCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Input,
  Option,
  Select,
  Switch,
  Textarea,
} from "@material-tailwind/react";
import CreateProductSize from "@/components/layout/admin/products/CreateProductSize";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discount: "",
    visibility: true,
    category: "",
    subCategory: {
      name: "",
      colour: "",
    },
    description: "",
    fabric: "",
    brand: "",
    images: [],
    sizes: [],
  });
  const fetchingProductData = async () => {
    try {
      const response = await fetch(`/api/product/${id}`);
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      toast.error("Error fetching product details");
    }
  };
  useEffect(() => {
    fetchingProductData();
  }, []);

  const [categories, setCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      visibility: e.target.checked,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 10) {
      toast.error("You can only upload up to 10 images.");
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));
  };

  const [deletedImages, setDeletedImages] = useState([]);

  const removeImage = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((e, i) => {
        setDeletedImages([...deletedImages, e]);
        return i !== index;
      }),
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.price ||
      !formData.discount ||
      !formData.description ||
      !formData.category ||
      !formData.subCategory.name
    ) {
      toast.error("All fields are required.");
      return;
    }
    if (formData.sizes.length < 1) {
      toast.error("Add a minimum of 1 size!");
      return;
    }
    if (formData.images.length < 4) {
      toast.error("Add a minimum of 4 images!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("discount", formData.discount);
    formDataToSend.append("visibility", formData.visibility);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("subCategory", JSON.stringify(formData.subCategory));
    formDataToSend.append("description", formData.description);
    formDataToSend.append("fabric", formData.fabric);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("sizes", JSON.stringify(formData.sizes));
    formData.images.forEach((image) => {
      if (image instanceof File) {
        formDataToSend.append("images", image);
      } else {
        formDataToSend.append("images", JSON.stringify(image));
      }
    });
    deletedImages.forEach((image) => {
      formDataToSend.append("deletedImages", JSON.stringify(image));
    });

    try {
      const response = await fetch(`/api/admin/product/${formData._id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Product updated successfully!");
      } else {
        toast.error(data.error);
      }
    } catch (e) {
      toast.error("Failed to update product. Please try again later.");
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <Heading
        icon={
          <div className="bg-gradient-to-r from-red-400 to-pink-400 p-1 rounded-full inline-block">
            <FaTshirt size={20} color="white" />
          </div>
        }
        title={"Update Product"}
      />
      <form
        onSubmit={submitForm}
        className="px-0 sm:px-4 flex flex-col gap-4 items-center justify-center"
      >
        <div className="w-full flex items-center gap-4 h-full">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
          <Switch
            checked={formData.visibility}
            label={`${formData.visibility ? "Visible" : "Invisible"}`}
            color="teal"
            onChange={handleSwitchChange}
          />
        </div>
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 h-full">
          <Input
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
          />
          <Input
            label="Discount"
            name="discount"
            value={formData.discount}
            onChange={(e) => {
              if (e.target.value > 100) {
                toast.error("Discount should not be more than 100%.");
                return;
              }
              handleInputChange(e);
            }}
          />
        </div>
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 h-full">
          <Select
            label="Select Category"
            name="category"
            value={formData.category}
            onChange={(value) => {
              setFormData({ ...formData, category: value });
              const selectedCategory = categories.find(
                (category) => category.name === value
              );
              if (selectedCategory) {
                setSelectedSubcategories(selectedCategory.subCategories);
              } else {
                setSelectedSubcategories([]);
              }
            }}
          >
            {categories.map((category) => (
              <Option key={category._id} value={category.name}>
                {category.name}
              </Option>
            ))}
          </Select>

          <Select
            label="Select Sub Category"
            name="subCategory"
            value={`${formData.subCategory.name}-${formData.subCategory.colour}`}
            onChange={(value) => {
              const [name, colour] = value.split("-");
              setFormData((prevState) => ({
                ...prevState,
                subCategory: {
                  name,
                  colour: colour.startsWith("#") ? colour : `#${colour}`,
                },
              }));
            }}
          >
            {selectedSubcategories.map((subcategory) => (
              <Option
                key={subcategory._id}
                value={`${subcategory.name}-${subcategory.colour}`}
              >
                {subcategory.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 h-full">
          <Input
            label="Fabric"
            name="fabric"
            value={formData.fabric}
            onChange={handleInputChange}
          />
          <Input
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full">
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <CreateProductSize formData={formData} setFormData={setFormData} />
        <div className="flex gap-4 flex-wrap w-full h-full">
          {formData.images?.map((image, index) => (
            <div
              key={index}
              className="w-16 h-20 relative group overflow-hidden rounded-md"
            >
              <div
                className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <MdDelete className="text-white text-2xl cursor-pointer hover:scale-125 transition-transform" />
              </div>
              {image instanceof File ? (
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`product image ${index}`}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <Image
                  src={image.url}
                  alt={`product image ${index}`}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Button
            variant="outlined"
            color="red"
            className="rounded w-full flex items-center gap-1 justify-center"
            type="button"
            onClick={() =>
              setFormData((prevState) => ({ ...prevState, images: [] }))
            }
          >
            <FolderMinusIcon className="w-6 h-6" /> Remove All Images
          </Button>
          <input
            type="file"
            multiple
            className="hidden"
            id="images"
            onChange={handleFileChange}
          />
          <label
            htmlFor="images"
            className="w-full bg-blue-500 text-white h-full flex justify-center items-center gap-1 py-3 rounded cursor-pointer uppercase text-sm hover:bg-light-blue-500 transition-all"
          >
            <ArrowUpCircleIcon className="w-6 h-6" />
            Upload Images{" "}
            <div className="font-semibold">{formData.images.length} / 10</div>
          </label>
          <Button
            variant="gradient"
            color="teal"
            className="rounded w-full flex items-center gap-1 justify-center"
            type="submit"
          >
            <PlusCircleIcon className="w-6 h-6" /> Update Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
