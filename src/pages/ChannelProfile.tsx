import { VideoCard } from "@/components";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/ui/PageContainer";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/hooks/useStore";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { formatCount } from "@/lib/video";
import {
  APIResponse,
  ChannelProfile as ChannelProfileType,
  GetVideosResponse,
} from "@/types/APIResponse";
import { IUser, IVideo } from "@/types/collections";
import { AxiosError } from "axios";
import {
  Camera,
  Check,
  Grid,
  ImagePlus,
  ListVideo,
  MessageCircle,
  Trash,
  Users,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

type isLoadingStates = {
  toggleSubscribe: boolean;
  coverImageChange: boolean;
  avatarImageChange: boolean;
  channelVideos: boolean;
};
interface QueryStates {
  channelVideosQuery: {
    page: number;
    limit: number;
  };
}

const ChannelProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const now = dayjs();

  const { userData } = useAppSelector((state) => state.authReducer);
  const { toast } = useToast();

  const isOwner = location.pathname === "/me";
  const channelname = params.channelname || userData?.username;
  //   console.log("isOwner: ", isOwner);

  const [channelProfile, setChannelProfile] =
    useState<ChannelProfileType | null>(null);

  const [isHoveringCover, setIsHoveringCover] = useState<boolean>(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState<boolean>(false);
  const [openDeleteCoverPopup, setOpenDeleteCoverPopup] =
    useState<boolean>(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<isLoadingStates>({
    toggleSubscribe: false,
    coverImageChange: false,
    avatarImageChange: false,
    channelVideos: false,
  });

  const [queryStates, setQueryStates] = useState<QueryStates>({
    channelVideosQuery: {
      page: 1,
      limit: 10,
    },
  });

  const [channelVideos, setChannelVideos] = useState<IVideo[]>([]);

  const [isFetchError, setIsFetchError] = useState<boolean>(false);

  const fetchChannelProfile = async (channelname: string) => {
    try {
      const { data } = await AxiosAPIInstance.get<
        APIResponse<ChannelProfileType>
      >(`/api/v1/user/channel/${channelname}`);

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

  const fetchChannelVideos = async (channelId: string) => {
    try {
      setIsLoading({ ...isLoading, channelVideos: true });
      const res = await AxiosAPIInstance.get<APIResponse<GetVideosResponse>>(
        `/api/v1/video?page=${queryStates.channelVideosQuery.page}&limit=${queryStates.channelVideosQuery.limit}&userId=${channelId}`
      );

      if (res.data.success && res.data.data?.docs) {
        setChannelVideos(res.data.data.docs);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to fetch videos",
          variant: "destructive",
        });
      }

      setIsFetchError(true);
      console.error(error);
    } finally {
      setIsLoading({ ...isLoading, channelVideos: false });
    }
  };

  const handleCoverImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      try {
        setIsLoading({ ...isLoading, coverImageChange: true });
        const newCoverImageFile = e.target.files[0];

        const { data } = await AxiosAPIInstance.patch<
          APIResponse<{ user: IUser }>
        >(
          "/api/v1/user/cover-image",
          {
            coverImage: newCoverImageFile,
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (data.success) {
          toast({ title: data.message });

          setChannelProfile((prevVal) => {
            if (!prevVal) return prevVal;

            return {
              ...prevVal,
              coverImage: data.data?.user.coverImage,
            };
          });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title:
              error.response?.data.message || "Failed to update cover image",
            variant: "destructive",
          });
        }
        setIsFetchError(true);
        console.error(error);
      } finally {
        setIsLoading({ ...isLoading, coverImageChange: false });
      }
    }
  };
  const handleCoverImageDelete = async () => {
    try {
      setIsLoading({ ...isLoading, coverImageChange: true });

      const { data } = await AxiosAPIInstance.delete<APIResponse<null>>(
        "/api/v1/user/cover-image"
      );

      if (data.success) {
        toast({ title: data.message });
        channelname && (await fetchChannelProfile(channelname));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to remove cover image",
          variant: "destructive",
        });
      }
      setIsFetchError(true);
      console.error(error);
    } finally {
      setIsLoading({ ...isLoading, coverImageChange: false });
      setOpenDeleteCoverPopup(false);
    }
  };
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      try {
        setIsLoading({ ...isLoading, avatarImageChange: true });
        const newAvatarFile = e.target.files[0];

        const { data } = await AxiosAPIInstance.patch<
          APIResponse<{ user: IUser }>
        >(
          "/api/v1/user/avatar",
          {
            avatar: newAvatarFile,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (data.success) {
          toast({ title: data.message });

          setChannelProfile((prevVal) => {
            if (!prevVal) return prevVal;

            return {
              ...prevVal,
              avatar: data.data?.user?.avatar || prevVal.avatar,
            };
          });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title:
              error.response?.data.message || "Failed to update cover image",
            variant: "destructive",
          });
        }

        setIsFetchError(true);
        console.error(error);
      } finally {
        setIsLoading({ ...isLoading, avatarImageChange: false });
      }
    }
  };

  const toggleSubscriptionHandler = async () => {
    try {
      setIsLoading({ ...isLoading, toggleSubscribe: true });
      const { data } = await AxiosAPIInstance.post<APIResponse<null>>(
        `/api/v1/subscription/channel/${channelProfile?._id}`
      );
      if (data.success) {
        toast({ title: data.message });

        setChannelProfile((prevValue) => {
          if (!prevValue) return prevValue;
          return {
            ...prevValue,
            isSubscribed: !prevValue.isSubscribed,
            subscriberCount:
              prevValue.subscriberCount + (prevValue.isSubscribed ? -1 : 1),
          };
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

  useEffect(() => {
    channelname && fetchChannelProfile(channelname);
  }, [channelname]);
  useEffect(() => {
    channelProfile?._id && fetchChannelVideos(channelProfile._id);
  }, [channelProfile?._id]);

  return (
    <PageContainer>
      <div className="h-32 md:h-48">
        <div
          className="relative w-full h-full"
          onMouseEnter={() => isOwner && setIsHoveringCover(true)}
          onMouseLeave={() => isOwner && setIsHoveringCover(false)}
        >
          {channelProfile?.coverImage?.url ? (
            <img
              src={channelProfile?.coverImage?.url}
              alt="Channel cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-background w-full h-full" />
          )}

          <input
            type="file"
            ref={coverInputRef}
            className="hidden"
            accept="image/jpeg,image/png"
            onChange={handleCoverImageChange}
            multiple={false}
          />
          {isOwner && isHoveringCover && (
            <div className="absolute inset-0 bg-muted hover:bg-transparent flex justify-center items-center gap-2">
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => coverInputRef.current?.click()}
                disabled={isLoading.coverImageChange}
              >
                <ImagePlus className="h-4 w-4" />
                {channelProfile?.coverImage?.url ? "Change" : "Add"} Cover Image
              </Button>

              {channelProfile?.coverImage?.url && (
                <Button
                  variant="secondary"
                  onClick={() => setOpenDeleteCoverPopup(true)}
                  disabled={isLoading.coverImageChange}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className="-mt-12 ml-4 md:ml-6 relative w-20 h-20 md:w-28 md:h-28"
        onMouseEnter={() => isOwner && setIsHoveringAvatar(true)}
        onMouseLeave={() => isOwner && setIsHoveringAvatar(false)}
      >
        <Avatar className="w-full h-full border-4 border-background">
          <AvatarImage src={channelProfile?.avatar.url} alt="Channel name" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <input
          type="file"
          ref={avatarInputRef}
          className="hidden"
          accept="image/jpeg,image/png"
          onChange={handleAvatarChange}
        />
        {isOwner && isHoveringAvatar && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white hover:bg-white/20"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isLoading.avatarImageChange}
            >
              <Camera className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>

      <div className="p-2 sm:p-4 md:p-6 flex flex-col md:flex-row items-start md:items-end gap-4">
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold">
            {channelProfile?.fullname}
          </h1>
          <p className="text-sm text-muted-foreground">
            @{channelProfile?.username}
          </p>
          <p className="text-sm text-muted-foreground flex items-center space-x-1">
            <span>{formatCount(channelProfile?.subscriberCount ?? 0)}</span>
            <span>
              {channelProfile?.subscriberCount &&
              channelProfile?.subscriberCount > 1
                ? " Subscribers"
                : " Subscriber"}
            </span>
            <span>•</span>
            <span>
              {formatCount(channelProfile?.subscribedToCount ?? 0)} Subscribed
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={channelProfile?.isSubscribed ? "secondary" : "default"}
            className="gap-2"
            onClick={toggleSubscriptionHandler}
            disabled={isLoading.toggleSubscribe}
          >
            {channelProfile?.isSubscribed && <Check className="h-4 w-4" />}
            {channelProfile?.isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
          {/* <Button
              variant="secondary"
              size="icon"
              onClick={toggleNotification}
            >
              {notificationState === "none" ? (
                <BellOff className="h-4 w-4" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
            </Button> */}
        </div>
      </div>
      <Separator />

      <div className="my-2 p-2 sm:p-4">
        <Tabs defaultValue="videos" className="space-y-2">
          <div className="overflow-x-auto">
            <TabsList>
              <TabsTrigger value="videos" className="gap-2">
                <ListVideo className="h-4 w-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="playlists" className="gap-2">
                <Grid className="h-4 w-4" />
                Playlists
              </TabsTrigger>
              <TabsTrigger value="subscribed" className="gap-2">
                <Users className="h-4 w-4" />
                Subscribed
              </TabsTrigger>
              <TabsTrigger value="tweets" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Tweets
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="videos">
            {channelVideos.length ? (
              <>
                <div className="px-2 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-items-center gap-4">
                  {channelVideos.map((video: IVideo) => (
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
              </>
            ) : (
              <p className="px-2 py-4 h-36 flex items-center justify-evenly">
                {!isLoading.channelVideos && "This channel has no videos yet."}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={openDeleteCoverPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to remove cover image?
            </AlertDialogTitle>
            <AlertDialogDescription />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setOpenDeleteCoverPopup(false)}
              disabled={isLoading.coverImageChange}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              disabled={isLoading.coverImageChange}
              onClick={handleCoverImageDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default ChannelProfile;
