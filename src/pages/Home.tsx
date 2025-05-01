import { VideoCard } from "@/components";
import PageContainer from "@/components/ui/PageContainer";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { IVideo } from "@/types/collections";
import React, { useEffect, useState } from "react";
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
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  CircleAlert,
} from "lucide-react";
import { setVideoStates } from "@/features/videoSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { setRenderLoadingOnSearchOrSort } from "@/features/uiSlice";

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
  const { renderLoadingOnSearchOrSort } = useAppSelector(
    (state) => state.uiReducer
  );

  const {
    data: videos,
    error,
    isLoading,
    loaderRef,
  } = useInfiniteFetch<IVideo>(
    `/api/v1/video?query=${query}&sortBy=${sortBy}&sortType=${sortType}`
  );

  useEffect(() => {
    dispatch(setRenderLoadingOnSearchOrSort(false));
  }, [videos]);

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
          {query.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 px-4 rounded-full text-secondary-foreground/85 hover:bg-secondary hover:text-secondary-foreground"
                  >
                    <CircleAlert className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-secondary text-secondary-foreground"
                >
                  Sorting functionality is disabled on search results
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <Select
            disabled={
              renderLoadingOnSearchOrSort || isLoading || query.length > 0
            }
            value={sortBy}
            onValueChange={(value) => {
              dispatch(setRenderLoadingOnSearchOrSort(true));

              dispatch(setVideoStates({ sortBy: value as keyof IVideo }));
            }}
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
              disabled={
                renderLoadingOnSearchOrSort || isLoading || query.length > 0
              }
              variant="outline"
              className="rounded-l-none rounded-r-full min-w-fit py-2 px-3 disabled:cursor-not-allowed"
              onClick={() => {
                dispatch(setRenderLoadingOnSearchOrSort(true));

                dispatch(setVideoStates({ sortType: "des" }));
              }}
            >
              <ArrowUpNarrowWide className="h-4 w-4" />
              Ascending
            </Button>
          )}
          {sortType === "des" && (
            <Button
              disabled={
                renderLoadingOnSearchOrSort || isLoading || query.length > 0
              }
              variant="outline"
              className="rounded-l-none rounded-r-full min-w-fit py-2 px-3 disabled:cursor-not-allowed"
              onClick={() => {
                dispatch(setRenderLoadingOnSearchOrSort(true));

                dispatch(setVideoStates({ sortType: "asc" }));
              }}
            >
              <ArrowDownNarrowWide className="h-4 w-4" />
              Descending
            </Button>
          )}
        </div>
      </div>

      {renderLoadingOnSearchOrSort ? (
        <div
          style={{ minHeight: "calc(100dvh - 142px)" }}
          className="flex items-center justify-around"
        >
          <Loader size="extraLarge" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 items-center justify-items-center gap-4">
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
      )}

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
