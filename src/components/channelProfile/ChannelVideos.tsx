import { GetVideosResponse } from "@/types/APIResponse";
import React from "react";
import VideoCard from "../home/VideoCard";
import { IVideo } from "@/types/collections";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

type ChannelVideoProps = {
  channelVideosRes: GetVideosResponse;
  isLoading: boolean;
};

const ChannelVideos: React.FC<ChannelVideoProps> = ({
  channelVideosRes,
  isLoading,
}) => {
  const navigate = useNavigate();
  const now = dayjs();

  if (channelVideosRes.docs.length) {
    return (
      <div className="px-2 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-items-center gap-4">
        {channelVideosRes.docs.map((video: IVideo) => (
          <VideoCard
            key={video._id}
            title={video.title}
            createdAt={dayjs(new Date(video.createdAt)).from(now)}
            duration={video.duration}
            thumbnail={video.thumbnail.url}
            views={video.views}
            channelDetails={{
              channelAvatar: video.owner.avatar as unknown as string,
              channelName: video.owner.fullname,
            }}
            onClick={() =>
              navigate(`/video/${video._id}`, {
                state: {
                  video,
                },
              })
            }
          />
        ))}
      </div>
    );
  }
  return (
    <p className="px-2 py-4 h-36 flex items-center justify-evenly">
      {!isLoading && "This channel has no videos yet."}
    </p>
  );
};

export default ChannelVideos;
