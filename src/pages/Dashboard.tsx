import {
  StatCard,
  VideoTable,
  VideoUpdateDialog,
  VideoUploadDialog,
} from "@/components";
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
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/ui/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { updateVideoSchema } from "@/schema";
import {
  APIResponse,
  ChannelStatsResponse,
  ChannelVideosResponse,
} from "@/types/APIResponse";
import { z } from "zod";
import { AxiosError } from "axios";
import { Eye, ThumbsUp, Upload, Users, Video } from "lucide-react";
import React, { useEffect, useState } from "react";

interface UpdateVideoModalData {
  videoId: string | null;
  initialValues: z.infer<typeof updateVideoSchema> | null;
}

const Dashboard: React.FC = () => {
  const [openVideoUploadModal, setOpenVideoUploadModal] =
    useState<boolean>(false);
  const [videoUploadModalDirty, setVideoUploadModalDirty] =
    useState<boolean>(false);

  const { toast } = useToast();

  const [channelStats, setChannelStats] = useState<ChannelStatsResponse>({
    totalLikes: 0,
    totalSubscribers: 0,
    totalVideos: 0,
    totalViews: 0,
  });

  const [channelVideosState, setChannelVideosState] =
    useState<ChannelVideosResponse>({
      docs: [],
      hasNextPage: false,
      hasPrevPage: false,
      limit: 10,
      nextPage: null,
      page: 1,
      pagingCounter: 0,
      prevPage: null,
      totalDocs: 0,
      totalPages: 0,
    });

  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null);
  const [updateVideoModalData, setUpdateVideoModalData] =
    useState<UpdateVideoModalData>({ initialValues: null, videoId: null });

  const [isDeleteInProgress, setIsDeleteInProgress] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setIsDeleteInProgress(true);
      if (deleteVideoId) {
        const { data } = await AxiosAPIInstance.delete<APIResponse<null>>(
          `/api/v1/dashboard/video/${deleteVideoId}`
        );

        if (data.success) {
          toast({ title: data.message });

          await fetchChannelStats();
          await fetchChannelVideos();

          setDeleteVideoId(null);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to delete video",
          variant: "destructive",
        });

        console.error(error);
      }
    } finally {
      setIsDeleteInProgress(false);
    }
  };

  const fetchChannelStats = async () => {
    try {
      const { data } = await AxiosAPIInstance.get<
        APIResponse<ChannelStatsResponse>
      >("/api/v1/dashboard/stats");

      if (data.success && data.data) {
        setChannelStats(data.data);
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast({
          title:
            error.response?.data.message || "Failed to fetch Chennel Stats",
          variant: "destructive",
        });

        console.error(error);
      }
    }
  };

  const fetchChannelVideos = async () => {
    try {
      const { data } = await AxiosAPIInstance.get<
        APIResponse<ChannelVideosResponse>
      >(
        `/api/v1/dashboard/videos?page=${channelVideosState.page}&limit=${channelVideosState.limit}`
      );

      if (data.success && data.data) {
        setChannelVideosState(data.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title:
            error.response?.data.message || "Failed to fetch Chennel Videos",
          variant: "destructive",
        });

        setChannelVideosState({
          docs: [],
          hasNextPage: false,
          hasPrevPage: false,
          limit: 10,
          nextPage: null,
          page: 1,
          pagingCounter: 0,
          prevPage: null,
          totalDocs: 0,
          totalPages: 0,
        });
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchChannelStats();
  }, []);
  useEffect(() => {
    if (
      (!openVideoUploadModal || updateVideoModalData.videoId === null) &&
      videoUploadModalDirty
    ) {
      fetchChannelStats();
      fetchChannelVideos();
      setVideoUploadModalDirty(false);
    }
  }, [openVideoUploadModal, updateVideoModalData.videoId]);

  useEffect(() => {
    fetchChannelVideos();
  }, [channelVideosState.limit, channelVideosState.page]);

  return (
    <PageContainer className="py-4 sm:py-8 lg:py-16 px-2 md:px-4 lg:px-6">
      <div className="flex items-center justify-between pr-2">
        <h1 className="text-2xl font-semibold">Channel Dashboard</h1>
        <Button
          onClick={() => setOpenVideoUploadModal(true)}
          className="hover:scale-105 transform transition duration-300 ease-in-out"
        >
          <Upload className="mr-2 h-4 w-4" /> Upload Video
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-evenly">
        <div className="w-full max-w-7xl p-2 gap-4 grid grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Subscribers"
            count={channelStats.totalSubscribers}
            Icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Total Videos"
            count={channelStats.totalVideos}
            Icon={<Video className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Total Views"
            count={channelStats.totalViews}
            Icon={<Eye className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Total Likes"
            count={channelStats.totalLikes}
            Icon={<ThumbsUp className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      </div>

      <Tabs defaultValue="videos" className="mx-auto mt-8 w-full max-w-7xl">
        <TabsList>
          <TabsTrigger className="font-semibold" value="videos">
            Videos
          </TabsTrigger>
          <TabsTrigger className="font-semibold" value="tweets">
            Tweets
          </TabsTrigger>
        </TabsList>
        <TabsContent value="videos">
          <VideoTable
            channelVideosState={channelVideosState}
            setChannelVideosState={setChannelVideosState}
            setDeleteVideoId={setDeleteVideoId}
            setUpdateVideoModalData={setUpdateVideoModalData}
          />
        </TabsContent>
        <TabsContent value="tweets">Change your password here.</TabsContent>
      </Tabs>

      <AlertDialog open={deleteVideoId !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this video?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              video from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleteInProgress}
              onClick={() => setDeleteVideoId(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleteInProgress}
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <VideoUploadDialog
        isOpen={openVideoUploadModal}
        setIsOpen={setOpenVideoUploadModal}
        setVideoUploadModalDirty={setVideoUploadModalDirty}
      />

      <VideoUpdateDialog
        updateVideoModalData={updateVideoModalData}
        setUpdateVideoModalData={setUpdateVideoModalData}
        setVideoUploadModalDirty={setVideoUploadModalDirty}
      />
    </PageContainer>
  );
};

export default Dashboard;
