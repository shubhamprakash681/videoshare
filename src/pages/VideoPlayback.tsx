import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IPlaylist, IVideo } from "@/types/collections";
import PageContainer from "@/components/ui/PageContainer";
import {
  AddPlaylistModal,
  CommentCard,
  CommentInput,
  RightPanel,
  VideoPlayer,
} from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import parse from "html-react-parser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ThumbsUp, ThumbsDown, MoreVertical } from "lucide-react";
import {
  APIResponse,
  ChannelProfile,
  GetPlaylistResponse,
  VideoCommentData,
  VideoLikeData,
} from "@/types/APIResponse";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { useAppSelector } from "@/hooks/useStore";
import { formatCount } from "@/lib/video";
import useSanitizedHTML from "@/hooks/useSanitizedHTML";
import Loader from "@/components/ui/Loader";
import ErrorStateComp from "@/components/ui/ErrorStateComp";
import useManualFetch from "@/hooks/useManualFetch";

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

const defaultChannelProfileData: ChannelProfile = {
  _id: "",
  avatar: {
    public_id: "",
    url: "",
  },
  coverImage: {
    public_id: "",
    url: "",
  },
  email: "",
  fullname: "",
  isSubscribed: false,
  subscribedToCount: 0,
  subscriberCount: 0,
  username: "",
};

type isLoadingStates = {
  toggleSubscribe: boolean;
  toggleLike: boolean;
};

const VideoPlayback: React.FC = () => {
  const location = useLocation();
  const { userData } = useAppSelector((state) => state.authReducer);
  const { toast } = useToast();
  const { sanitizeHTMLContent } = useSanitizedHTML();

  const now = dayjs();

  const [channelProfile, setChannelProfile] = useState<ChannelProfile>(
    defaultChannelProfileData
  );

  const locationStates = location.state as {
    video: IVideo;
    playlist: IPlaylist;
  };

  const [videoData, setVideoData] = useState<IVideo | undefined>(
    locationStates && locationStates.video ? locationStates.video : undefined
  );
  const [playlistData, setPlaylistData] = useState<IPlaylist | undefined>(
    locationStates && locationStates.playlist
      ? locationStates.playlist
      : undefined
  );
  const [loadingFirstTime, setLoadingFirstTime] = useState<boolean>(true);

  const [videoLikeData, setVideoLikeData] = useState<VideoLikeData | null>(
    null
  );

  const {
    data: commentsData,
    error: commentsError,
    isLoading: isCommentsLoading,
    onLoadMoreClick: onCommentsLoadMoreClick,
    refreshData: refreshVideoComments,
  } = useManualFetch<VideoCommentData>(`/api/v1/comment/${videoData?._id}`);

  const [isFetchError, setIsFetchError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<isLoadingStates>({
    toggleSubscribe: false,
    toggleLike: false,
  });

  const [isSmallerScreen, setIsSmallerScreen] = useState<boolean>(true);

  const resizeHandler = () => {
    if (window.innerWidth < 1280) {
      setIsSmallerScreen(true);
    } else {
      setIsSmallerScreen(false);
    }
  };

  const toggleSubscriptionHandler = async () => {
    try {
      setIsLoading({ ...isLoading, toggleSubscribe: true });
      const { data } = await AxiosAPIInstance.post<APIResponse<null>>(
        `/api/v1/subscription/channel/${videoData?.owner._id}`
      );
      if (data.success) {
        toast({ title: data.message });
        setChannelProfile({
          ...channelProfile,
          isSubscribed: !channelProfile?.isSubscribed,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title:
            error.response?.data.message || "Failed to change subscription",
          variant: "destructive",
        });
      }

      setIsFetchError(true);
      console.error(error);
    } finally {
      setIsLoading({ ...isLoading, toggleSubscribe: false });
    }
  };

  const fetchChannelProfile = async (channelname: string) => {
    try {
      const { data } = await AxiosAPIInstance.get<APIResponse<ChannelProfile>>(
        `/api/v1/user/channel/${channelname}`
      );

      if (data.success && data.data) {
        setChannelProfile(data.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title:
            error.response?.data.message || "Failed to fetch channel profile",
          variant: "destructive",
        });
      }

      setIsFetchError(true);
      console.error(error);
    }
  };

  const fetchVideoLikeData = async () => {
    try {
      setIsLoading({ ...isLoading, toggleLike: true });
      const { data } = await AxiosAPIInstance.get<APIResponse<VideoLikeData>>(
        `/api/v1/video/likes/${videoData?._id}`
      );
      if (data.success && data.data) {
        setVideoLikeData(data.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to fetch like data",
          variant: "destructive",
        });
      }

      setIsFetchError(true);
      console.error(error);
    } finally {
      setIsLoading({ ...isLoading, toggleLike: false });
    }
  };

  const toggleLike = async () => {
    try {
      setIsLoading({ ...isLoading, toggleLike: true });
      const { data } = await AxiosAPIInstance.post<APIResponse<null>>(
        `/api/v1/like/video/${videoData?._id}?likeType=${
          videoLikeData?.isLiked ? "delete" : "like"
        }`
      );
      if (data.success) {
        toast({ title: data.message });
        fetchVideoLikeData();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to like video",
          variant: "destructive",
        });
      }

      setIsFetchError(true);
      console.error(error);
    } finally {
      setIsLoading({ ...isLoading, toggleLike: false });
    }
  };
  const toggleDislike = async () => {
    try {
      setIsLoading({ ...isLoading, toggleLike: true });
      const { data } = await AxiosAPIInstance.post<APIResponse<null>>(
        `/api/v1/like/video/${videoData?._id}?likeType=${
          videoLikeData?.isDisliked ? "delete" : "dislike"
        }`
      );
      if (data.success) {
        toast({ title: data.message });
        fetchVideoLikeData();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to dislike video",
          variant: "destructive",
        });
      }

      setIsFetchError(true);
      console.error(error);
    } finally {
      setIsLoading({ ...isLoading, toggleLike: false });
    }
  };

  const handleRefresh = async () => {
    if (videoData?.owner.username) {
      await fetchChannelProfile(videoData?.owner.username);
    }
    await fetchVideoLikeData();
    await refreshVideoComments();

    setIsFetchError(false);
  };

  const getPageName: () => "video" | "playlist" | null = () => {
    const splittedPathname = location.pathname.split("/");

    if (splittedPathname.includes("video")) {
      return "video";
    } else if (splittedPathname.includes("playlist")) {
      return "playlist";
    }

    return null;
  };

  // Function to handle full page refresh when error occurs or when user landed on the page directly
  const handleFullPageRefresh = async () => {
    const pageName = getPageName();
    const splittedPathname = location.pathname.split("/");

    if (
      pageName === "video" &&
      (!videoData || videoData._id !== locationStates?.video?._id)
    ) {
      // fetch video data
      try {
        const { data } = await AxiosAPIInstance.get<APIResponse<IVideo>>(
          `/api/v1/video/${splittedPathname[splittedPathname.length - 1]}`
        );

        if (data.success && data.data) {
          setVideoData(data.data);
          setLoadingFirstTime(false);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title: error.response?.data.message || "Failed to fetch video",
            variant: "destructive",
          });
        }

        console.error(error);
      }
    } else if (
      pageName === "playlist" &&
      (!playlistData || playlistData._id !== locationStates?.playlist?._id)
    ) {
      // fetch playlist data
      try {
        const { data } = await AxiosAPIInstance.get<
          APIResponse<GetPlaylistResponse>
        >(`/api/v1/playlist/${splittedPathname[splittedPathname.length - 1]}`);

        if (data.success && data.data?.docs.length) {
          setPlaylistData(data.data?.docs[0]);
          setVideoData(data.data?.docs[0].videos[0] as unknown as IVideo);
          setLoadingFirstTime(false);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title: error.response?.data.message || "Failed to fetch playlist",
            variant: "destructive",
          });
        }

        console.error(error);
      }
    } else {
      setLoadingFirstTime(false);
    }
  };

  useEffect(() => {
    handleFullPageRefresh();
  }, [locationStates]);

  useEffect(() => {
    if (videoData?._id) {
      fetchChannelProfile(videoData.owner.username);
      fetchVideoLikeData();
    }
  }, [videoData?._id]);

  useEffect(() => {
    resizeHandler();

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  if (loadingFirstTime) {
    return (
      <PageContainer className="py-4 sm:py-6 lg:py-8 px-2 md:px-4 lg:px-6 flex items-center">
        <Loader />
      </PageContainer>
    );
  }

  if (!videoData) {
    return (
      <PageContainer className="py-4 sm:py-6 lg:py-8 px-2 md:px-4 lg:px-6 flex items-center">
        <ErrorStateComp handleRefresh={handleFullPageRefresh} />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-4 sm:py-6 lg:py-8 px-2 md:px-4 lg:px-6">
      <div
        className={`grid ${!isSmallerScreen && "gap-3 2xl:gap-6"}`}
        style={{ gridTemplateColumns: isSmallerScreen ? "1fr" : "1fr 480px" }}
      >
        <div className="mx-auto max-w-7xl">
          <VideoPlayer videoData={videoData} />

          <div className="mt-4">
            <h1 className="text-2xl font-bold mb-2">{videoData?.title}</h1>

            {isFetchError ? (
              <ErrorStateComp handleRefresh={handleRefresh} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <Link
                    to={
                      userData?._id === videoData?.owner._id
                        ? "/me"
                        : `/${videoData?.owner.username}`
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={videoData?.owner.avatar as unknown as string}
                          alt="Channel Avatar"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold">
                          {videoData?.owner.fullname}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {channelProfile && channelProfile.subscriberCount}{" "}
                          {channelProfile && channelProfile.subscriberCount > 1
                            ? "Subscribers"
                            : "Subscriber"}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {channelProfile?.isSubscribed ? (
                    <Button
                      variant="outline"
                      className="bg-red-600 hover:bg-red-700 text-white hover:text-white border-none"
                      onClick={toggleSubscriptionHandler}
                      disabled={isLoading.toggleSubscribe}
                    >
                      {isLoading.toggleSubscribe
                        ? "Unsubscribing..."
                        : "Unsubscribe"}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={toggleSubscriptionHandler}
                      disabled={isLoading.toggleSubscribe}
                    >
                      {isLoading.toggleSubscribe
                        ? "Subscribing..."
                        : "Subscribe"}
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    disabled={isLoading.toggleLike}
                    onClick={toggleLike}
                  >
                    <ThumbsUp
                      className={`h-4 w-4 ${
                        videoLikeData?.isLiked && "fill-current"
                      }`}
                    />
                    {formatCount(videoLikeData?.likeCount ?? 0)}
                    {videoLikeData?.likeCount === 1 ||
                    videoLikeData?.likeCount === 0
                      ? " Like"
                      : " Likes"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    disabled={isLoading.toggleLike}
                    onClick={toggleDislike}
                  >
                    <ThumbsDown
                      className={`h-4 w-4 ${
                        videoLikeData?.isDisliked && "fill-current"
                      }`}
                    />
                    <span>Dislike</span>
                  </Button>
                  <AddPlaylistModal
                    videoId={videoData?._id}
                    videoTitle={videoData?.title}
                  />
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm mb-2 space-x-1">
                    <span>
                      {formatCount(videoData?.views)}
                      {videoData?.views > 1 ? " views" : " view"}
                    </span>
                    <span>•</span>
                    <span>
                      {dayjs(new Date(videoData?.createdAt)).from(now)}
                    </span>
                  </p>
                  <p className="text-sm">
                    {parse(sanitizeHTMLContent(videoData?.description))}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">Comments</h3>

            <CommentInput
              isInputFocusedByDefault={false}
              userAvatarUrl={userData?.avatar.url || ""}
              refreshVideoComments={refreshVideoComments}
              videoId={videoData?._id}
            />

            {commentsError ? (
              <ErrorStateComp handleRefresh={handleRefresh} />
            ) : (
              <>
                {commentsData?.docs.map((comment: VideoCommentData) => (
                  <CommentCard
                    key={comment._id}
                    commentData={comment}
                    currTimestamp={now}
                    refreshVideoComments={refreshVideoComments}
                    videoId={videoData?._id}
                  />
                ))}

                {commentsData.hasNextPage ? (
                  <div className="my-5">
                    {isCommentsLoading ? (
                      <Loader />
                    ) : (
                      <Button
                        onClick={onCommentsLoadMoreClick}
                        className="w-full"
                        variant="secondary"
                      >
                        Load More
                      </Button>
                    )}
                  </div>
                ) : commentsData.docs.length ? (
                  <div className="text-center my-5 text-muted-foreground">
                    No more comments
                  </div>
                ) : (
                  <div className="text-center my-5 text-muted-foreground">
                    This video does not have any comment yet.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {getPageName() && (
          <div className={`${isSmallerScreen ? "py-4" : "pl-2 2xl:pl-4"}`}>
            <RightPanel
              pageName={getPageName() as "video" | "playlist"}
              playlistData={playlistData}
              currentVideoId={videoData._id}
              setVideoData={setVideoData}
              handleFullPageRefresh={handleFullPageRefresh}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default VideoPlayback;
