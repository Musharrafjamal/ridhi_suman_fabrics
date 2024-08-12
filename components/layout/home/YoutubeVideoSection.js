"use client";
import { Button } from "@material-tailwind/react";
import React, { useState } from "react";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
export default function YoutubeVideo() {
  const [playingIndex, setPlayingIndex] = useState(null);

  const videos = [
    {
      url: "https://youtu.be/H8Lyj2D_cWo?si=vQ7raZ0AKDdHmwjS",
      views: "250K+ VIEWS",
    },
    {
      url: "https://youtu.be/_eJ6KAb56Gw?si=Cp0R9lg4TTxowR5S",
    },
    {
      url: "https://youtu.be/V7zkC5aPvoY?si=cZKF_kMqFPkyaD8x",
    },
  ];

  return (
    <section className="mb-10">
      <div className="text-center w-full lg:w-1/2 mx-auto ">
        <h2 className="text-red-600 text-2xl font-semibold">
          Most Popular Latest Videos From Our Youtube Channel
        </h2>
        <p className="text-gray-600 mt-2">
          Stay Ahead Of The Fashion Curve With Our YouTube Channel, Featuring
          Our Most Popular Videos. Explore Trendsetting Style Guides And
          Exclusive Behind-The-Scenes Content, Keeping You At The Forefront Of
          Fashion.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 px-4">
        {videos.map((video, index) => (
          <div
            key={index}
            className="relative group"
            onMouseEnter={() => setPlayingIndex(index)}
            onMouseLeave={() => setPlayingIndex(null)}
            onClick={() => window.open(video.url, "_blank")}
          >
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <ReactPlayer
                url={video.url}
                playing={playingIndex === index}
                muted
                width="100%"
                height="100%"
                controls={false}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button className="bg-red-500 rounded-full p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  stroke="white"
                  className="w-6 h-6"
                >
                  <path d="M5 3v18l15-9L5 3z" />
                </svg>
              </Button>
            </div>
            {video.views && (
              <div className="absolute bottom-4 left-4 bg-red-500 text-white px-2 py-1 rounded">
                {video.views}
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className="text-center mt-6"
        onClick={() =>
          window.open("https://www.youtube.com/@piyushgargdev", "_blank")
        }
      >
        <Button className="bg-white text-gray-800 border border-gray-300   rounded shadow hover:bg-gray-100">
          VIEW MORE VIDEOS
        </Button>
      </div>
    </section>
  );
}
