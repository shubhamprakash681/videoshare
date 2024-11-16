import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IVideo } from "@/types/collections";
import PageContainer from "@/components/ui/PageContainer";
import { VideoPlayer } from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import parse from "html-react-parser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ThumbsUp, ThumbsDown, Share2, MoreVertical } from "lucide-react";

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

const VideoPlayback: React.FC = () => {
  const location = useLocation();
  const now = dayjs();

  const videoData = location.state as { video: IVideo };
  console.log("videoData: ", videoData);

  const [isSmallerScreen, setIsSmallerScreen] = useState<boolean>(true);

  const resizeHandler = () => {
    if (window.innerWidth < 1280) {
      setIsSmallerScreen(true);
    } else {
      setIsSmallerScreen(false);
    }
  };

  useEffect(() => {
    resizeHandler();

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <PageContainer className="py-4 sm:py-8 lg:py-16 px-2 md:px-4 lg:px-6">
      <div
        className="grid"
        style={{ gridTemplateColumns: isSmallerScreen ? "1fr" : "1fr 350px" }}
      >
        <div className="mx-auto max-w-7xl">
          <VideoPlayer videoData={videoData.video} />

          <div className="mt-4">
            <h1 className="text-2xl font-bold mb-2">{videoData.video.title}</h1>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={videoData.video.owner.avatar as unknown as string}
                    alt="Channel Avatar"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">
                    {videoData.video.owner.fullname}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    HARDCODED 1.2M subscribers
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-red-600 hover:bg-red-700 text-white hover:text-white border-none"
              >
                HARDCODED Subscribe
              </Button>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <ThumbsUp className="h-4 w-4" />
                <span>123K</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <ThumbsDown className="h-4 w-4" />
                <span>Dislike</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-sm mb-2 space-x-1">
                <span>{videoData.video.views} views</span>
                <span>•</span>
                <span>
                  {dayjs(new Date(videoData.video.createdAt)).from(now)}
                </span>
              </p>
              <p className="text-sm">{parse(videoData.video.description)}</p>
            </div>
          </div>
        </div>

        <div className={`${isSmallerScreen ? "py-4" : "pl-2"}`}>
          Suggestions
        </div>
      </div>
    </PageContainer>
  );
};

export default VideoPlayback;
