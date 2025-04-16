import PageContainer from "@/components/ui/PageContainer";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import useInfiniteFetch from "@/hooks/useInfiniteFetch";
import { IUser, PlaylistVideo } from "@/types/collections";
import { useAppSelector } from "@/hooks/useStore";
import ErrorStateComp from "@/components/ui/ErrorStateComp";
import { VideoCard } from "@/components";
import Loader from "@/components/ui/Loader";

dayjs.extend(relativeTime);

const WatchHistory: React.FC = () => {
  const now = dayjs();
  const navigate = useNavigate();

  const { userData } = useAppSelector((state) => state.authReducer);

  const { data, error, isLoading, loaderRef } = useInfiniteFetch<PlaylistVideo>(
    "/api/v1/user/watch-history"
  );

  const handleRefresh = () => {
    window.location.reload();
  };

  const navigateToPlaylist = (video: PlaylistVideo) => {
    let sortedWatchHistory: IUser["watchHistory"] | undefined = undefined;
    if (userData?.watchHistory) {
      // sorting in asc
      sortedWatchHistory = JSON.parse(
        JSON.stringify(userData?.watchHistory)
      ).sort(
        (x: { watchedAt: string }, y: { watchedAt: string }) =>
          new Date(x.watchedAt).getMilliseconds() -
          new Date(y.watchedAt).getMilliseconds()
      );
    }

    navigate(`/watch-playlist/$${video._id}`, {
      state: {
        playlist: {
          _id: null,
          title: "Watch History",
          description: "Your Watch History Playlist",
          visibility: "private",
          owner: userData?._id,
          createdAt: sortedWatchHistory
            ? sortedWatchHistory[0].watchedAt
            : new Date(),
          updatedAt: sortedWatchHistory
            ? sortedWatchHistory[sortedWatchHistory.length - 1].watchedAt
            : new Date(),

          videos: data.docs,
        },
        video,
      },
    });
  };

  if (error)
    return (
      <PageContainer className="flex items-center justify-evenly">
        <ErrorStateComp handleRefresh={handleRefresh} />
      </PageContainer>
    );

  return (
    <PageContainer className="p-2 sm:p-3 md:p-4 lg:p-8">
      <h1 className="text-xl font-semibold">Watch History</h1>

      <div className="mt-2 sm:mt-3 md:mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 items-center justify-items-center gap-4">
        {data.docs.map((video) => (
          <VideoCard
            key={video._id}
            title={video.title}
            createdAt={dayjs(new Date(video.createdAt)).from(now)}
            duration={video.duration}
            thumbnail={video.thumbnail.url}
            views={video.views}
            channelDetails={{
              channelAvatar: video.owner.avatar,
              channelName: video.owner.fullname,
            }}
            onClick={() => navigateToPlaylist(video)}
          />
        ))}
      </div>

      <div ref={loaderRef} className="text-center my-5">
        {isLoading && <Loader />}
      </div>

      {!data.hasNextPage &&
        (data.docs.length ? (
          <div className="text-center my-5 text-muted-foreground">
            No more videos
          </div>
        ) : (
          <div className="text-center my-5 text-muted-foreground">
            Your Watch History is empty
          </div>
        ))}
    </PageContainer>
  );
};

export default WatchHistory;
