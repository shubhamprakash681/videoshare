import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IVideo } from "@/types/collections";
import PageContainer from "@/components/ui/PageContainer";
import { CommentCard, CommentInput, VideoPlayer } from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import parse from "html-react-parser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ThumbsUp, ThumbsDown, Share2, MoreVertical } from "lucide-react";
import {
  APIResponse,
  ChannelProfile,
  GetVideoCommentsResponse,
  VideoCommentData,
  VideoLikeData,
} from "@/types/APIResponse";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { useAppSelector } from "@/hooks/useStore";
import { formatCount } from "@/lib/video";

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

type ErrorStateCompProps = {
  handleRefresh: () => void;
};
const ErrorStateComp: React.FC<ErrorStateCompProps> = ({ handleRefresh }) => {
  return (
    <div className="w-full h-28 flex flex-col items-center justify-evenly">
      <p>
        Failed to fetch resources. Please{" "}
        <Button onClick={handleRefresh} className="p-0 h-fit" variant="link">
          Refresh
        </Button>{" "}
        this page
      </p>
    </div>
  );
};

type isLoadingStates = {
  toggleSubscribe: boolean;
  toggleLike: boolean;
  videoCommentsLoading: boolean;
};

const VideoPlayback: React.FC = () => {
  const location = useLocation();
  const { userData } = useAppSelector((state) => state.authReducer);
  const { toast } = useToast();

  const now = dayjs();

  const [channelProfile, setChannelProfile] = useState<ChannelProfile>(
    defaultChannelProfileData
  );
  const videoData = location.state as { video: IVideo };
  const [videoLikeData, setVideoLikeData] = useState<VideoLikeData | null>(
    null
  );
  const [commentQueryStates, setCommentQueryStates] = useState<{
    limit: number;
    page: number;
  }>({ limit: 10, page: 1 });
  const [commentsData, setCommentsData] =
    useState<GetVideoCommentsResponse | null>(null);

  const [isFetchError, setIsFetchError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<isLoadingStates>({
    toggleSubscribe: false,
    toggleLike: false,
    videoCommentsLoading: false,
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
        `/api/v1/subscription/channel/${videoData.video.owner._id}`
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
        `/api/v1/video/likes/${videoData.video._id}`
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

  const fetchVideoComments = async () => {
    try {
      setIsLoading({ ...isLoading, videoCommentsLoading: true });

      const { data } = await AxiosAPIInstance.get<
        APIResponse<GetVideoCommentsResponse>
      >(
        `/api/v1/comment/${videoData.video._id}?page=${commentQueryStates.page}&limit=${commentQueryStates.limit}`
      );

      if (data.success && data.data) {
        setCommentsData(data.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title:
            error.response?.data.message || "Failed to fetch comments data",
          variant: "destructive",
        });
      }

      setIsFetchError(true);
      console.error(error);
    } finally {
      setIsLoading({ ...isLoading, videoCommentsLoading: false });
    }
  };
  const refreshVideoComments = async () => {
    setCommentsData(null);
    setCommentQueryStates({ limit: 10, page: 1 });

    await fetchVideoComments();
  };

  const toggleLike = async () => {
    try {
      setIsLoading({ ...isLoading, toggleLike: true });
      const { data } = await AxiosAPIInstance.post<APIResponse<null>>(
        `/api/v1/like/video/${videoData.video._id}?likeType=${
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
        `/api/v1/like/video/${videoData.video._id}?likeType=${
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
    if (videoData.video.owner.username) {
      await fetchChannelProfile(videoData.video.owner.username);
    }
    await fetchVideoLikeData();
    setCommentQueryStates({ limit: 10, page: 1 });

    setIsFetchError(false);
  };
  useEffect(() => {
    if (videoData.video.owner.username) {
      fetchChannelProfile(videoData.video.owner.username);
    }
    fetchVideoLikeData();
  }, [videoData.video.owner.username]);
  useEffect(() => {
    fetchVideoComments();
  }, [videoData.video._id, commentQueryStates.page, commentQueryStates.limit]);

  useEffect(() => {
    resizeHandler();

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <PageContainer className="py-4 sm:py-6 lg:py-8 px-2 md:px-4 lg:px-6">
      <div
        className="grid"
        style={{ gridTemplateColumns: isSmallerScreen ? "1fr" : "1fr 350px" }}
      >
        <div className="mx-auto max-w-7xl">
          <VideoPlayer videoData={videoData.video} />

          <div className="mt-4">
            <h1 className="text-2xl font-bold mb-2">{videoData.video.title}</h1>

            {isFetchError ? (
              <ErrorStateComp handleRefresh={handleRefresh} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <Link
                    to={
                      userData?._id === videoData.video.owner._id
                        ? "/me"
                        : `/${videoData.video.owner.username}`
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            videoData.video.owner.avatar as unknown as string
                          }
                          alt="Channel Avatar"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold">
                          {videoData.video.owner.fullname}
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
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm mb-2 space-x-1">
                    <span>
                      {formatCount(videoData.video.views)}
                      {videoData.video.views > 1 ? " views" : " view"}
                    </span>
                    <span>•</span>
                    <span>
                      {dayjs(new Date(videoData.video.createdAt)).from(now)}
                    </span>
                  </p>
                  <p className="text-sm">
                    {parse(videoData.video.description)}
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
              videoId={videoData.video._id}
            />

            {commentsData?.totalDocs === 0 && (
              <p className="w-full text-center text-muted-foreground">
                This video does not have any comment yet.
              </p>
            )}

            {/* Comments */}
            {commentsData?.docs.map((comment: VideoCommentData) => (
              <CommentCard
                key={comment._id}
                commentData={comment}
                currTimestamp={now}
                refreshVideoComments={refreshVideoComments}
                videoId={videoData.video._id}
              />
            ))}
          </div>
        </div>

        <div className={`${isSmallerScreen ? "py-4" : "pl-2"}`}>
          <h3 className="font-semibold">Suggestions</h3>
        </div>
      </div>
    </PageContainer>
  );
};

export default VideoPlayback;
