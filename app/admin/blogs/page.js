"use client";

import { FaTshirt } from "react-icons/fa";
import { RiApps2AddFill } from "react-icons/ri";

import { useEffect, useState } from "react";

import Heading from "@/components/ui/heading/Heading";
import DefaultBtn from "@/components/ui/buttons/DefaultBtn";

import DeleteBlog from "@/components/modals/admin/blogs/DeleteBlog";
import CreateBlog from "@/components/modals/admin/blogs/CreateBlog";
import EditBlog from "@/components/modals/admin/blogs/EditBlog";

const Page = () => {
  const [loading, setLoading] = useState(true);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const btns = [
    <DefaultBtn
      key={1}
      icon={<RiApps2AddFill />}
      title={"Create blog"}
      clickHandler={() => {
        setOpenCreateDialog(true);
      }}
    />,
  ];

  return (
    <>
      <div
        className={`grid place-items-center min-h-screen absolute w-full bg-white transition-all duration-700 top-0 ${
          loading ? "opacity-100" : "opacity-0"
        } ${loading ? "z-50" : "-z-50"}`}
      >
        <div className="loader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <main
        className={`${
          loading ? "hidden" : "block"
        } transition-all duration-700`}
      >
        <DeleteBlog open={openDeleteDialog} setOpen={setOpenDeleteDialog} />

        <CreateBlog open={openCreateDialog} setOpen={setOpenCreateDialog} />

        <EditBlog open={openEditDialog} setOpen={setOpenEditDialog} />

        <div className="my-4">
          <div className="px-8 mb-4">
            <Heading
              icon={
                <div className="bg-gradient-to-r from-red-400 to-pink-400 p-1 rounded-full inline-block">
                  <FaTshirt size={20} color="white" />
                </div>
              }
              title={"Manage Blogs"}
              buttons={btns}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
