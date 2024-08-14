"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import Image from "next/image";

const BlogCard = () => {
  return (
    <Card className="w-full max-w-[26rem] shadow-lg m-5 border pt-5 mx-auto md:mx-5 ">
      <div className="relative w-[350px] h-[250px] mx-auto flex items-center justify-center group ">
        <div className="w-[320px] h-[210px] bg-pink-100 -rotate-12 rounded-md transition-transform duration-300 ease-in-out group-hover:rotate-12"></div>
        <Image
          src="https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          alt="ui/ux review check"
          width={328}
          height={230}
          className="absolute top-2 left-2 z-10 object-cover rounded-md group "
        />
      </div>
      <CardBody>
        <div className="flex justify-between mb-3">
          <div className="text-center w-fit px-3 py-1 bg-pink-500 rounded-md text-sm text-white">
            Travel
          </div>
          <div className="text-gray-400">28 May 2024</div>
        </div>
        <h1 className="font-bold mb-2">Blog title</h1>
        <Typography color="gray">
          Enter a freshly updated and thoughtfully furnished peaceful home
          surrounded by ancient trees, stone walls, and open meadows.
        </Typography>
      </CardBody>
      <CardFooter className="mx-auto">
        <Button size="lg" color="pink">
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
