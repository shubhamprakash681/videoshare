import { VideoCard } from "@/components";
import PageContainer from "@/components/ui/PageContainer";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { IVideo } from "@/types/collections";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import useInfiniteFetch from "@/hooks/useInfiniteFetch";
import ErrorStateComp from "@/components/ui/ErrorStateComp";
import Loader from "@/components/ui/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { setVideoStates } from "@/features/videoSlice";

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const now = dayjs();

  const handleRefresh = () => {
    window.location.reload();
  };

  const { query, sortBy, sortType } = useAppSelector(
    (state) => state.videoReducer
  );

  const {
    data: videos,
    error,
    isLoading,
    loaderRef,
  } = useInfiniteFetch<IVideo>(
    `/api/v1/video?query=${query}&sortBy=${sortBy}&sortType=${sortType}`
  );

  if (error)
    return (
      <PageContainer className="flex items-center justify-evenly">
        <ErrorStateComp handleRefresh={handleRefresh} />
      </PageContainer>
    );

  return (
    <PageContainer className="p-2 sm:p-3 md:p-4 lg:p-8">
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center pl-2">
          <Select
            value={sortBy}
            onValueChange={(value) =>
              dispatch(setVideoStates({ sortBy: value as keyof IVideo }))
            }
          >
            <SelectTrigger className="rounded-l-full rounded-r-none py-2 px-3 hover:bg-secondary focus:border-none min-w-fit gap-2">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                className="cursor-pointer hover:bg-secondary"
                value="title"
              >
                Title
              </SelectItem>
              <SelectItem
                className="cursor-pointer hover:bg-secondary"
                value="views"
              >
                Views
              </SelectItem>
              <SelectItem
                className="cursor-pointer hover:bg-secondary"
                value="duration"
              >
                Duration
              </SelectItem>
              <SelectItem
                className="cursor-pointer hover:bg-secondary"
                value="createdAt"
              >
                Created At
              </SelectItem>
            </SelectContent>
          </Select>

          {sortType === "asc" && (
            <Button
              variant="outline"
              className="rounded-l-none rounded-r-full min-w-fit py-2 px-3"
              onClick={() => dispatch(setVideoStates({ sortType: "des" }))}
            >
              <ArrowUpNarrowWide className="h-4 w-4" />
              Ascending
            </Button>
          )}
          {sortType === "des" && (
            <Button
              variant="outline"
              className="rounded-l-none rounded-r-full min-w-fit py-2 px-3"
              onClick={() => dispatch(setVideoStates({ sortType: "asc" }))}
            >
              <ArrowDownNarrowWide className="h-4 w-4" />
              Descending
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center justify-items-center gap-4">
        {videos.docs.map((video: IVideo) => (
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

      <div ref={loaderRef} className="text-center my-5">
        {isLoading && <Loader />}
      </div>

      {!videos.hasNextPage &&
        (videos.docs.length ? (
          <div className="text-center my-5 text-muted-foreground">
            No more videos
          </div>
        ) : (
          <div className="text-center my-5 text-muted-foreground">
            No Videos matching this criteria
          </div>
        ))}
    </PageContainer>
  );
};

export default Home;
