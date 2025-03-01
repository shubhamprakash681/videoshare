import { VideoCard } from "@/components";
import ErrorStateComp from "@/components/ui/ErrorStateComp";
import PageContainer from "@/components/ui/PageContainer";
import useInfiniteFetch from "@/hooks/useInfiniteFetch";
import { LikedVideo } from "@/types/collections";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Loader from "@/components/ui/Loader";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);

const LikedVideos: React.FC = () => {
  const navigate = useNavigate();
  const now = dayjs();

  const { data, error, isLoading, loaderRef } = useInfiniteFetch<LikedVideo>(
    "/api/v1/like/videos"
  );

  const handleRefresh = () => {
    window.location.reload();
  };

  const navigateToPlaylist = (likedVideo: LikedVideo) => {
    const playlistVideos = data.docs.map((video) => video.video);

    navigate(`/like-playlist/${likedVideo._id}`, {
      state: {
        playlist: {
          _id: null,
          title: "Liked Videos",
          description: "Your Liked Videos Playlist",
          visibility: "public",
          owner: likedVideo.likedBy,
          createdAt: dayjs(
            new Date(playlistVideos[playlistVideos.length - 1].createdAt)
          ).from(now),
          updatedAt: dayjs(new Date(playlistVideos[0].createdAt)).from(now),

          videos: playlistVideos,
        },
        video: likedVideo.video,
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
      <h1 className="text-xl font-semibold">Liked Videos</h1>

      <div className="mt-2 sm:mt-3 md:mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center justify-items-center gap-4">
        {data?.docs?.map((likedVideo) => (
          <VideoCard
            key={likedVideo._id}
            title={likedVideo.video.title}
            createdAt={dayjs(new Date(likedVideo.video.createdAt)).from(now)}
            duration={likedVideo.video.duration}
            thumbnail={likedVideo.video.thumbnail.url}
            views={likedVideo.video.views}
            channelDetails={{
              channelAvatar: likedVideo.video.owner.avatar,
              channelName: likedVideo.video.owner.fullname,
            }}
            onClick={() => navigateToPlaylist(likedVideo)}
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
            No Loked Videos
          </div>
        ))}
    </PageContainer>
  );
};

export default LikedVideos;
