import { IPlaylist, IVideo } from "@/types/collections";
import React, { memo, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { GripVertical, ListVideo } from "lucide-react";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useInfiniteFetch from "@/hooks/useInfiniteFetch";
import Loader from "../ui/Loader";
import ErrorStateComp from "../ui/ErrorStateComp";
import { useNavigate } from "react-router-dom";
import Image from "../ui/Image";

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

interface ISuggestionSection {
  currentVideoId: string;
  handleFullPageRefresh: () => Promise<void>;
  now: dayjs.Dayjs;
}
const SuggestionSection: React.FC<ISuggestionSection> = memo(
  ({ currentVideoId, handleFullPageRefresh, now }) => {
    const navigate = useNavigate();

    const { data, error, isLoading, loaderRef } = useInfiniteFetch<IVideo>(
      `/api/v1/video/suggestions/${currentVideoId}`
    );

    if (error) return <ErrorStateComp handleRefresh={handleFullPageRefresh} />;

    return (
      <div>
        {data.docs.map((video) => (
          <div
            key={video._id}
            onClick={() =>
              navigate(`/video/${video._id}`, {
                state: {
                  video,
                },
              })
            }
            className="flex items-start gap-1 sm:gap-2 px-0 py-2 sm:p-2 rounded-lg hover:bg-accent cursor-pointer group"
          >
            <div className="flex items-center">
              <Image
                src={video.thumbnail.url || "/placeholder.svg"}
                alt={video.title}
                className="w-40 h-24 object-cover rounded-lg"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium line-clamp-2">{video.title}</h3>
              <div className="flex flex-col sm:flex-row mt-1 gap-1 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <span>{video.duration}</span>
                  <span>•</span>
                  <span>{video.views.toLocaleString()} views</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <span>Added {dayjs(new Date(video.createdAt)).from(now)}</span>
              </div>
            </div>
          </div>
        ))}

        <div ref={loaderRef} className="text-center my-5">
          {isLoading && <Loader />}
        </div>

        {!data.hasNextPage &&
          (data.docs.length ? (
            <div className="text-center my-5 text-muted-foreground">
              No more suggestions
            </div>
          ) : (
            <div className="text-center my-5 text-muted-foreground">
              No Suggestions for this video
            </div>
          ))}
      </div>
    );
  }
);

interface IPlaylistRightPanelProps {
  playlistData?: IPlaylist;
  currentVideoId: string;
  handleFullPageRefresh: () => Promise<void>;
  setVideoData?: React.Dispatch<React.SetStateAction<IVideo | undefined>>;
  now: dayjs.Dayjs;
}
const PlaylistRightPanel: React.FC<IPlaylistRightPanelProps> = memo(
  ({
    playlistData,
    currentVideoId,
    handleFullPageRefresh,
    setVideoData,
    now,
  }) => {
    const [playlistQueue, setPlaylistQueue] = useState<IPlaylist["videos"]>(
      playlistData?.videos || []
    );
    const [draggedVideo, setDraggedVideo] = useState<string | null>(null);

    const handleDragEnd = (): void => {
      setDraggedVideo(null);
    };

    const handleDragStart = (videoId: string): void => {
      setDraggedVideo(videoId);
    };

    const handleDragOver = (
      event: React.DragEvent<HTMLDivElement>,
      index: number
    ): void => {
      event.preventDefault();

      if (draggedVideo === null || !playlistQueue.length) return;

      const items = playlistQueue || [];
      const draggedItem = items.find((item) => item._id === draggedVideo);
      if (!draggedItem) return;

      const currentIndex = items.findIndex((item) => item._id === draggedVideo);
      items.splice(currentIndex, 1);
      items.splice(index, 0, draggedItem);

      setPlaylistQueue(items);
    };

    return (
      <Card>
        <CardHeader className="py-3 sm:py-6 px-4 sm:px-6">
          <div className="flex flex-row items-center gap-2">
            <ListVideo className="h-5 w-5" />
            <span className="font-semibold mt-0">{playlistData?.title}</span>
          </div>
        </CardHeader>
        <Separator />

        <CardContent className="px-1 py-3">
          <Tabs defaultValue="queue">
            <TabsList className="w-full flex items-center justify-evenly">
              <TabsTrigger className="w-full" value="queue">
                Playlist Queue
              </TabsTrigger>
              <TabsTrigger className="w-full" value="suggestions">
                Suggestions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="queue">
              {playlistQueue.map((video, index) => {
                const isSelected = video._id === currentVideoId;

                return (
                  <div
                    key={video._id}
                    draggable
                    onDragStart={() => handleDragStart(video._id)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onClick={() =>
                      setVideoData && setVideoData(video as unknown as IVideo)
                    }
                    className={`flex items-start gap-1 sm:gap-2 px-0 py-2 sm:p-2 rounded-lg hover:bg-accent cursor-pointer group ${
                      isSelected && "bg-secondary"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Image
                        src={video.thumbnail.url || "/placeholder.svg"}
                        alt={video.title}
                        className="w-40 h-24 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex flex-col sm:flex-row mt-1 gap-1 text-sm text-muted-foreground">
                        <div className="flex gap-1">
                          <span>{video.duration}</span>
                          <span>•</span>
                          <span>{video.views.toLocaleString()} views</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          Added {dayjs(new Date(video.createdAt)).from(now)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="suggestions">
              <SuggestionSection
                currentVideoId={currentVideoId}
                now={now}
                handleFullPageRefresh={handleFullPageRefresh}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }
);

interface RightPanelProps {
  pageName: "video" | "playlist" | "like-playlist";
  playlistData?: IPlaylist;
  currentVideoId: string;
  setVideoData?: React.Dispatch<React.SetStateAction<IVideo | undefined>>;
  handleFullPageRefresh: () => Promise<void>;
}
const RightPanel: React.FC<RightPanelProps> = ({
  pageName,
  playlistData,
  currentVideoId,
  setVideoData,
  handleFullPageRefresh,
}) => {
  const now = dayjs();

  if (pageName === "playlist" || pageName === "like-playlist")
    return (
      <PlaylistRightPanel
        playlistData={playlistData}
        handleFullPageRefresh={handleFullPageRefresh}
        currentVideoId={currentVideoId}
        setVideoData={setVideoData}
        now={now}
      />
    );

  return (
    <Card>
      <CardHeader className="py-3 sm:py-6 px-4 sm:px-6">
        <div className="flex flex-row items-center gap-2">
          {/* <ListVideo className="h-5 w-5" /> */}
          <span className="font-semibold mt-0">Suggestions</span>
        </div>
      </CardHeader>
      <Separator />

      <CardContent className="px-1 py-3">
        <SuggestionSection
          currentVideoId={currentVideoId}
          handleFullPageRefresh={handleFullPageRefresh}
          now={now}
        />
      </CardContent>
    </Card>
  );
};

export default RightPanel;
