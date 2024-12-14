import { StatCard, VideoUploadDialog } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageContainer from "@/components/ui/PageContainer";
import { useToast } from "@/hooks/use-toast";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse } from "@/types/APIResponse";
import { AxiosError } from "axios";
import { Eye, ThumbsUp, Upload, Users, Video } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ChannelStatsResponse {
  totalLikes: number;
  totalViews: number;
  totalVideos: number;
  totalSubscribers: number;
}
const Dashboard: React.FC = () => {
  const [openVideoUploadModal, setOpenVideoUploadModal] =
    useState<boolean>(false);
  const [videoUploadModalDirty, setVideoUploadModalDirty] =
    useState<boolean>(false);

  const [channelStats, setChannelStats] = useState<ChannelStatsResponse>({
    totalLikes: 0,
    totalSubscribers: 0,
    totalVideos: 0,
    totalViews: 0,
  });

  const { toast } = useToast();

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

  useEffect(() => {
    fetchChannelStats();
  }, []);
  useEffect(() => {
    if (!openVideoUploadModal && videoUploadModalDirty) {
      fetchChannelStats();
      setVideoUploadModalDirty(false);
    }
  }, [openVideoUploadModal]);

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

      <div className="mx-auto mt-8 flex items-center justify-evenly w-full max-w-7xl">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Your Videos</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Published</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell>{video.views.toLocaleString()}</TableCell>
                    <TableCell>{video.likes.toLocaleString()}</TableCell>
                    <TableCell>{video.comments.toLocaleString()}</TableCell>
                    <TableCell>{video.published}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table> */}
          </CardContent>
        </Card>
      </div>

      <VideoUploadDialog
        isOpen={openVideoUploadModal}
        setIsOpen={setOpenVideoUploadModal}
        setVideoUploadModalDirty={setVideoUploadModalDirty}
      />
    </PageContainer>
  );
};

export default Dashboard;
