import { AggregatedResponse } from "@/types/APIResponse";
import React from "react";
import VideoCard from "../home/VideoCard";
import { IVideo } from "@/types/collections";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ErrorStateComp from "../ui/ErrorStateComp";
import Loader from "../ui/Loader";

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

type ChannelVideoProps = {
  channelVideosRes: AggregatedResponse<IVideo>;
  channelVideosError: Error | undefined;
  channelVideosLoading: boolean;
  channelVideosLoaderRef: React.RefObject<HTMLDivElement>;
  channelVideosRefresh: () => Promise<void>;
  isOwner: boolean;
};

const ChannelVideos: React.FC<ChannelVideoProps> = ({
  channelVideosRes,
  channelVideosError,
  channelVideosLoaderRef,
  channelVideosLoading,
  channelVideosRefresh,
  isOwner,
}) => {
  const navigate = useNavigate();
  const now = dayjs();

  if (channelVideosError)
    return <ErrorStateComp handleRefresh={channelVideosRefresh} />;

  return (
    <div>
      <div className="p-2 sm:p-3 md:p-4 lg:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 items-center justify-items-center gap-4">
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

      <div ref={channelVideosLoaderRef} className="text-center my-5">
        {channelVideosLoading && <Loader />}
      </div>

      {!channelVideosRes.hasNextPage &&
        (channelVideosRes.docs.length ? (
          <div className="text-center my-5 text-muted-foreground">
            No more videos
          </div>
        ) : (
          <div className="text-center my-5 text-muted-foreground">
            {isOwner ? "Your" : "This"} channel has no videos yet.
          </div>
        ))}
    </div>
  );
};

export default ChannelVideos;
