import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import PageContainer from "@/components/ui/PageContainer";
import BundledEditor from "@/components/ui/rte/BundledEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse, GetPlaylistResponse } from "@/types/APIResponse";
import { IPlaylist } from "@/types/collections";
import { AxiosError } from "axios";
import parse from "html-react-parser";
import {
  ArrowLeft,
  Globe,
  GripVertical,
  Info,
  Lock,
  Pencil,
  Save,
  Trash2,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useSanitizedHTML from "@/hooks/useSanitizedHTML";
import { formatVideoDuration } from "@/lib/video";
import { Label } from "@/components/ui/label";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ErrorStateComp from "@/components/ui/ErrorStateComp";

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

const getVisibilityIcon = (visibility: "public" | "private" | "all") => {
  if (visibility === "private") {
    return <Lock className="h-4 w-4" />;
  }

  return <Globe className="h-4 w-4" />;
};

interface EditPlaylistProps {}

const EditPlaylist: React.FC<EditPlaylistProps> = ({}) => {
  const { playlistId } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  const { sanitizeHTMLContent } = useSanitizedHTML();
  const playlistURLInputRef = useRef<HTMLInputElement>(null);
  const playlistLink = `${window.location.origin}/playlist/${playlistId}`;
  const now = dayjs();

  const { playlist } = location.state as { playlist: IPlaylist };
  const [playlistData, setPlaylistData] = useState<IPlaylist | undefined>(
    playlist
  );
  const totalPlayListDuration: number =
    playlistData?.videos.reduce((acc, video) => acc + video.duration, 0) ?? 0;

  const [playlistDataLoding, setPlaylistDataLoading] = useState<boolean>(false);
  const [playlistdataError, setPlaylistDataError] = useState<boolean>(false);
  const [isEditingPlaylist, setIsEditingPlaylist] = useState<{
    tittle: boolean;
    description: boolean;
    visibility: boolean;
  }>({ tittle: false, description: false, visibility: false });
  const [isScreenDirty, setIsScreenDirty] = useState<boolean>(false);

  const [playlistVideos, setPlaylistVideos] = useState<IPlaylist["videos"]>([]);
  const [draggedVideo, setDraggedVideo] = useState<string | null>(null);
  const [isDragAreaDirty, setIsDragAreaDirty] = useState<boolean>(false);

  const [removeVideoId, setRemoveVideoId] = useState<string | null>(null);
  const [isRemoveVideoInProgress, setIsRemoveVideoInProgress] =
    useState<boolean>(false);

  const fetchPlaylistData = async () => {
    setPlaylistDataLoading(true);
    try {
      const { data } = await AxiosAPIInstance.get<
        APIResponse<GetPlaylistResponse>
      >(`/api/v1/playlist/${playlistId}`);

      if (data.success && data.data?.docs.length) {
        setPlaylistData(data.data.docs[0]);
        setPlaylistDataError(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to fetch playlist",
          variant: "destructive",
        });
      }

      setPlaylistDataError(true);
      console.error(error);
    } finally {
      setPlaylistDataLoading(false);
    }
  };

  const resetIsEditing = () => {
    setIsEditingPlaylist({
      tittle: false,
      description: false,
      visibility: false,
    });
  };

  const refreshScreenData = async () => {
    if (isScreenDirty) {
      await fetchPlaylistData();
    }

    resetIsEditing();
    setIsScreenDirty(false);
  };

  const editPlaylistHandler = async () => {
    setPlaylistDataLoading(true);
    try {
      const { data } = await AxiosAPIInstance.put<
        APIResponse<GetPlaylistResponse>
      >(`/api/v1/playlist/${playlistId}`, {
        title: playlistData?.title,
        description: playlistData?.description,
        visibility: playlistData?.visibility,
        videos: playlistData?.videos.map((video) => video._id.toString()),
      });

      if (data.success && data.data?.docs.length) {
        setPlaylistData(data.data.docs[0]);
        setPlaylistDataError(false);

        resetIsEditing();
        setIsScreenDirty(false);

        toast({
          title: data.message,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to update playlist",
          variant: "destructive",
        });

        setPlaylistDataError(true);
        console.error(error);
      }
    } finally {
      setPlaylistDataLoading(false);
    }
  };

  const handleRemoveVideo = async () => {
    if (removeVideoId) {
      try {
        setIsRemoveVideoInProgress(true);

        const { data } = await AxiosAPIInstance.put<
          APIResponse<GetPlaylistResponse>
        >(`/api/v1/playlist/${playlistId}`, {
          title: playlistData?.title,
          description: playlistData?.description,
          visibility: playlistData?.visibility,
          videos: playlistVideos
            .map((video) => video._id.toString())
            .filter((videoId) => videoId !== removeVideoId),
        });

        if (data.success && data.data?.docs.length) {
          setPlaylistData((prev) => {
            if (prev) {
              return {
                ...prev,
                videos: data.data?.docs[0].videos ?? [],
              };
            }
            return prev;
          });

          setRemoveVideoId(null);

          toast({
            title: "Video removed from playlist",
          });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title: "Failed to remove video from playlist",
            variant: "destructive",
          });

          console.error(error);
        }
      } finally {
        setIsRemoveVideoInProgress(false);
      }
    }
  };

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

    if (draggedVideo === null || !playlistVideos.length) return;

    const items = playlistVideos || [];
    const draggedItem = items.find((item) => item._id === draggedVideo);
    if (!draggedItem) return;

    const currentIndex = items.findIndex((item) => item._id === draggedVideo);
    items.splice(currentIndex, 1);
    items.splice(index, 0, draggedItem);

    setPlaylistVideos(items);
    setIsDragAreaDirty(true);
  };

  const saveVideoOrder = async () => {
    setPlaylistDataLoading(true);

    try {
      const { data } = await AxiosAPIInstance.put<
        APIResponse<GetPlaylistResponse>
      >(`/api/v1/playlist/${playlistId}`, {
        title: playlistData?.title,
        description: playlistData?.description,
        visibility: playlistData?.visibility,
        videos: playlistVideos.map((video) => video._id.toString()),
      });

      if (data.success && data.data?.docs.length) {
        setPlaylistData(data.data.docs[0]);
        setPlaylistDataError(false);
        setIsDragAreaDirty(false);

        toast({
          title: "Playlist video order saved",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Failed to save playlist video order",
          variant: "destructive",
        });

        console.error(error);
      }
    } finally {
      setPlaylistDataLoading(false);
    }
  };

  const playlistLinkCopyHandler = () => {
    navigator.clipboard.writeText(playlistLink);
    playlistURLInputRef.current?.focus();
    toast({
      title: "Playlist link copied to clipboard",
    });
  };

  const editorInitConfig = useMemo(
    () => ({
      height: 200,
      menubar: false,
      plugins: [
        "advlist",
        "anchor",
        "autolink",
        "help",
        "image",
        "link",
        "lists",
        "searchreplace",
        "table",
        "wordcount",
        "directionality",
      ],
      directionality: "ltr",
      toolbar:
        "undo redo | blocks | " +
        "bold italic forecolor | alignleft aligncenter " +
        "alignright alignjustify | bullist numlist outdent indent | ",
      content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
    }),
    []
  );

  useEffect(() => {
    if (!playlistData) {
      // Make API call for fetching playlistData
      fetchPlaylistData();
    }
  }, [playlistData]);

  useEffect(() => {
    if (playlistData) {
      setPlaylistVideos(playlistData.videos);
    }
  }, [playlistData?.videos]);

  if (playlistDataLoding) {
    return (
      <PageContainer className="flex items-center">
        <Loader />
      </PageContainer>
    );
  }

  if (playlistdataError) {
    return (
      <PageContainer className="flex items-center justify-evenly">
        <ErrorStateComp handleRefresh={refreshScreenData} />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-4 sm:py-8 lg:py-16 px-2 md:px-4 lg:px-6">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/me">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Playlist</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  {isEditingPlaylist.tittle ? (
                    <div className="space-y-2">
                      <Input
                        value={playlistData?.title}
                        onChange={(e) => {
                          setPlaylistData((prev) => {
                            if (prev) {
                              return {
                                ...prev,
                                title: e.target.value,
                              };
                            }

                            return prev;
                          });

                          !isScreenDirty && setIsScreenDirty(true);
                        }}
                        className="text-lg font-bold"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between group">
                      <h2 className="text-lg font-bold">
                        {playlistData?.title}
                      </h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setIsEditingPlaylist((prev) => ({
                            ...prev,
                            tittle: true,
                          }))
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {isEditingPlaylist.description ? (
                    <div className="space-y-2">
                      <BundledEditor
                        id="edit-playlist-description"
                        value={playlistData?.description}
                        onEditorChange={(value: string) => {
                          setPlaylistData((prev) => {
                            if (prev) {
                              return {
                                ...prev,
                                description: value,
                              };
                            }

                            return prev;
                          });

                          !isScreenDirty && setIsScreenDirty(true);
                        }}
                        init={editorInitConfig} // Prevent config changes from re-mounting
                      />
                    </div>
                  ) : (
                    <div className="flex items-start justify-between group">
                      <p className="text-sm text-muted-foreground">
                        {parse(
                          sanitizeHTMLContent(
                            playlistData?.description as string
                          )
                        )}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setIsEditingPlaylist((prev) => ({
                            ...prev,
                            description: true,
                          }))
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {getVisibilityIcon(playlistData?.visibility || "public")}
                  <Select
                    value={playlistData?.visibility}
                    onValueChange={(value: "public" | "private") => {
                      setPlaylistData((prev) => {
                        if (prev) {
                          return {
                            ...prev,
                            visibility: value,
                          };
                        }

                        return prev;
                      });

                      setIsEditingPlaylist((prev) => ({
                        ...prev,
                        visibility: true,
                      }));
                      !isScreenDirty && setIsScreenDirty(true);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem
                        className="cursor-pointer hover:bg-secondary"
                        value="private"
                      >
                        Private
                      </SelectItem>
                      <SelectItem
                        className="cursor-pointer hover:bg-secondary"
                        value="public"
                      >
                        Public
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(isEditingPlaylist.tittle ||
                  isEditingPlaylist.visibility ||
                  isEditingPlaylist.description) && (
                  <div className="flex items-center justify-end space-x-4">
                    <Button
                      variant={"outline"}
                      size="sm"
                      onClick={refreshScreenData}
                      disabled={playlistDataLoding}
                    >
                      Cancel
                    </Button>

                    <Button
                      size="sm"
                      onClick={editPlaylistHandler}
                      disabled={!isScreenDirty || playlistDataLoding}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Videos List */}
          <Card>
            <CardContent className="p-2 sm:p-4 md:p-6">
              {playlistVideos.length ? (
                <>
                  <div className="max-h-[600px] space-y-4 overflow-y-auto">
                    {playlistVideos.map((video, index) => (
                      <div
                        key={video._id}
                        draggable
                        onDragStart={() => handleDragStart(video._id)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className="flex items-start gap-1 sm:gap-2 md:gap-4 px-0 py-2 sm:p-2 md:p-4 lg:p-6 rounded-lg hover:bg-accent group"
                      >
                        <div className="flex items-center">
                          <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <img
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

                        <div className="flex items-center gap-1 md:gap-2">
                          {playlistVideos.length === 1 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="flex items-center justify-center p-2 w-9 rounded-full cursor-default"
                                  >
                                    <Info className="h-2 w-2" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    You cannot delete this video as it is the
                                    only video in this Playlist
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <Button
                            variant="destructive"
                            className="flex items-center justify-center p-2 w-9 rounded-full"
                            onClick={() => setRemoveVideoId(video._id)}
                            disabled={playlistVideos.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    {isDragAreaDirty && (
                      <div className="flex items-center justify-end mt-4">
                        <Button
                          onClick={saveVideoOrder}
                          disabled={playlistDataLoding}
                        >
                          Save Order
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="h-36 flex items-center justify-evenly">
                  This Playlist has no public videos.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Playlist Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total videos</span>
                    <span>{playlistData?.videos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total duration
                    </span>
                    <span>{formatVideoDuration(totalPlayListDuration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last updated</span>
                    <span>{dayjs(playlistData?.updatedAt).from(now)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Playlist URL</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={playlistLink}
                    ref={playlistURLInputRef}
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={playlistLinkCopyHandler}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={removeVideoId !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to remove this video?
            </AlertDialogTitle>
            <AlertDialogDescription />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setRemoveVideoId(null)}
              disabled={isRemoveVideoInProgress}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              disabled={isRemoveVideoInProgress}
              onClick={handleRemoveVideo}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default EditPlaylist;
