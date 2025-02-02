import { APIResponse, ChannelVideosResponse } from "@/types/APIResponse";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Switch } from "../ui/switch";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { Button } from "../ui/button";
import { z } from "zod";
import { updateVideoSchema } from "@/schema";
import { IVideo } from "@/types/collections";
import ErrorStateComp from "../ui/ErrorStateComp";
import Loader from "../ui/Loader";

type VideoTableProps = {
  channelVideosState: ChannelVideosResponse;
  channelVideosResError: Error | undefined;
  isChannelVideosResLoading: boolean;
  channelVideosResLoaderRef: React.RefObject<HTMLDivElement>;
  refetchChannelVideos: () => Promise<void>;

  setDeleteVideoId: React.Dispatch<React.SetStateAction<string | null>>;
  setUpdateVideoModalData: React.Dispatch<
    React.SetStateAction<{
      videoId: string | null;
      initialValues: z.infer<typeof updateVideoSchema> | null;
    }>
  >;
};

const VideoTable: React.FC<VideoTableProps> = ({
  channelVideosState,
  channelVideosResError,
  isChannelVideosResLoading,
  channelVideosResLoaderRef,
  refetchChannelVideos,
  setDeleteVideoId,
  setUpdateVideoModalData,
}) => {
  const { toast } = useToast();

  const [toggleVideoInProgress, setToggleVideoInProgress] =
    useState<boolean>(false);

  const toggleIsPublic = async (videoId: string): Promise<void> => {
    try {
      setToggleVideoInProgress(true);

      const { data } = await AxiosAPIInstance.patch<APIResponse<null>>(
        `/api/v1/dashboard/video/${videoId}`
      );

      if (data.success) {
        await refetchChannelVideos();

        toast({ title: data.message });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to switch video state",
          variant: "destructive",
        });
      }

      console.error(error);
    } finally {
      setToggleVideoInProgress(false);
    }
  };

  const onUpdateClick = async (video: IVideo) => {
    const thumbnailFile = createFileList([
      await urlToFile(video.thumbnail.url, "thumbnail.png"),
    ]);

    setUpdateVideoModalData({
      videoId: video._id,
      initialValues: {
        description: video.description,
        title: video.title,
        thumbnail: thumbnailFile ?? undefined,
      },
    });
  };

  if (channelVideosResError)
    return (
      <Card className="w-full mb-20">
        <CardHeader>
          <CardTitle className="text-xl">Your Videos</CardTitle>
        </CardHeader>

        <CardContent>
          <ErrorStateComp handleRefresh={refetchChannelVideos} />;
        </CardContent>
      </Card>
    );

  return (
    <Card className="w-full mb-20">
      <CardHeader>
        <CardTitle className="text-xl">Your Videos</CardTitle>
      </CardHeader>

      <CardContent>
        {channelVideosState.docs?.length ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Video</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Toggle Published</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {channelVideosState.docs.map((video) => (
                  <TableRow key={video._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <img
                          src={video.thumbnail.url}
                          alt={video.title}
                          className="w-20 h-12 object-cover rounded"
                        />
                        <span className="font-medium">{video.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-2 text-gray-400" />
                        {video.views.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 mr-2 text-gray-400"
                        >
                          <path d="M7 10v12" />
                          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                        </svg>
                        {video.likeCount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 mr-2 text-gray-400"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {video.commentCount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <VideoPublicTag isPublic={video.isPublic} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`${video._id}-toggle`}
                          checked={video.isPublic}
                          onCheckedChange={() => toggleIsPublic(video._id)}
                          disabled={toggleVideoInProgress}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full h-full flex items-center justify-evenly">
                        <Button
                          variant="outline"
                          onClick={() => onUpdateClick(video)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() => setDeleteVideoId(video._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div ref={channelVideosResLoaderRef} className="text-center my-5">
              {isChannelVideosResLoading && <Loader />}
            </div>

            {!channelVideosState.hasNextPage && (
              <div className="text-center my-5 text-muted-foreground">
                No more videos
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center min-h-20 text-muted-foreground">
            No video present
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoTable;

const VideoPublicTag: React.FC<{ isPublic: boolean }> = ({ isPublic }) => {
  if (isPublic)
    return (
      <span className="border-green-500 border rounded-lg p-1 bg-green-50 dark:bg-green-700">
        Published
      </span>
    );

  return (
    <span className="border-red-500 border rounded-lg p-1 bg-red-50 dark:bg-red-700">
      Unpublished
    </span>
  );
};

const urlToFile = async (url: string, fileName: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};
// Create a "FileList"-like object
const createFileList = (files: File[]) => {
  const dataTransfer = new DataTransfer(); // Create a DataTransfer object
  files.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer.files; // This is now a FileList
};
