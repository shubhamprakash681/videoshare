import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IVideo } from "@/types/collections";
import PageContainer from "@/components/ui/PageContainer";
import { VideoPlayer } from "@/components";

const VideoPlayback: React.FC = () => {
  const location = useLocation();
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
        <div className="mx-auto max-w-7xl aspect-video">
          <VideoPlayer videoData={videoData.video} />
        </div>

        <div className={`${isSmallerScreen ? "py-4" : "pl-2"}`}>
          Suggestions
        </div>
      </div>

      {/* <div className="mt-4">
          <h1 className="text-2xl font-bold mb-2">Video Title Goes Here</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="Channel Avatar"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">Channel Name</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  1.2M subscribers
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              Subscribe
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
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm mb-2">1.5M views • 3 days ago</p>
            <p className="text-sm">
              This is the video description. It can be quite long and may
              contain multiple paragraphs. You can expand this section to show
              more details about the video, including links and additional
              information.
            </p>
          </div>
        </div> */}
    </PageContainer>
  );
};

export default VideoPlayback;
