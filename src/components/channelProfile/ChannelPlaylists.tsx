import { AggregatedResponse, APIResponse } from "@/types/APIResponse";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Loader from "../ui/Loader";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Globe, Lock, MoreVertical, Pencil, Play, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import parse from "html-react-parser";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { useToast } from "@/hooks/use-toast";
import useSanitizedHTML from "@/hooks/useSanitizedHTML";
import { useNavigate } from "react-router-dom";
import { IPlaylist } from "@/types/collections";
import ErrorStateComp from "../ui/ErrorStateComp";
import Image from "../ui/Image";

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

const FormattedPlaylistDescription: React.FC<{ htmlContent: string }> = ({
  htmlContent,
}) => {
  const { sanitizeHTMLContent } = useSanitizedHTML();

  const truncateHTML = (html: string, length: number) => {
    const stripped = sanitizeHTMLContent(html);

    const truncated =
      stripped.length > length ? `${stripped.slice(0, length)}...` : stripped;
    return truncated;
  };

  const truncatedHTML = truncateHTML(htmlContent, 60);
  return <div>{parse(truncatedHTML)}</div>;
};

type EmptyPlaylistTextSectionProps = {
  isOwner: boolean;
  selectedPlaylistVisibility: "public" | "private" | "all";
};
const EmptyPlaylistTextSection: React.FC<EmptyPlaylistTextSectionProps> = ({
  isOwner,
  selectedPlaylistVisibility,
}) => {
  if (isOwner) {
    if (
      selectedPlaylistVisibility === "private" ||
      selectedPlaylistVisibility === "public"
    ) {
      return (
        <div className="text-center my-5 text-muted-foreground">
          Your Channel has no {selectedPlaylistVisibility} playlist yet.
        </div>
      );
    }

    return (
      <div className="text-center my-5 text-muted-foreground">
        Your Channel has no playlist yet.
      </div>
    );
  }

  return (
    <div className="text-center my-5 text-muted-foreground">
      This Channel has no playlist yet.
    </div>
  );
};

interface PlaylistResultProps {
  selectedPlaylistVisibility: "public" | "private" | "all";
  isOwner: boolean;
  channelPlaylistRes: AggregatedResponse<IPlaylist>;
  channelPlaylistErr: Error | undefined;
  channelPlaylistLoading: boolean;
  channelPlaylistLoaderRef: React.RefObject<HTMLDivElement>;
  refreshChannelPlaylist: () => Promise<void>;
}
const PlaylistResult: React.FC<PlaylistResultProps> = ({
  selectedPlaylistVisibility,
  isOwner,
  channelPlaylistRes,
  channelPlaylistErr,
  channelPlaylistLoaderRef,
  channelPlaylistLoading,
  refreshChannelPlaylist,
}) => {
  const now = dayjs();

  const { toast } = useToast();
  const navigate = useNavigate();

  const [playlistIdToDelete, setPlaylistIdToDelete] = useState<string | null>(
    null
  );
  const [isDeleteInProgress, setIsDeleteInProgress] = useState<boolean>(false);

  const handlePlaylistDelete = async () => {
    try {
      setIsDeleteInProgress(true);

      if (playlistIdToDelete) {
        const { data } = await AxiosAPIInstance.delete<APIResponse<null>>(
          `/api/v1/playlist/${playlistIdToDelete}`
        );

        if (data.success) {
          toast({ title: data.message });

          await refreshChannelPlaylist();
          setPlaylistIdToDelete(null);
        }
      }
    } catch (error) {
    } finally {
      setIsDeleteInProgress(false);
    }
  };

  const navigateToPlaylist = (playlist: IPlaylist) => {
    navigate(`/playlist/${playlist._id}`, {
      state: { playlist, video: playlist.videos[0] },
    });
  };

  const getVisibilityIcon = (visibility: "public" | "private" | "all") => {
    if (visibility === "private") {
      return <Lock className="h-4 w-4" />;
    }

    return <Globe className="h-4 w-4" />;
  };

  if (channelPlaylistErr)
    return <ErrorStateComp handleRefresh={refreshChannelPlaylist} />;

  return (
    <>
      <div className="p-2 sm:p-3 md:p-4 lg:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 items-center justify-items-center gap-4">
        {channelPlaylistRes.docs.map((playlist) => (
          <Card
            key={playlist._id}
            className="w-full min-w-full overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:shadow-gray-700/30"
          >
            <CardHeader className="relative p-0">
              <div className="group relative">
                <Image
                  src={playlist.videos[0]?.thumbnail.url || "/placeholder.svg"}
                  alt={playlist.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => navigateToPlaylist(playlist)}
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-white text-sm">
                  {playlist.videos.length} videos
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {playlist.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground h-10">
                    <FormattedPlaylistDescription
                      htmlContent={playlist.description}
                    />
                  </p>
                </div>
                {isOwner && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-36 flex flex-col space-y-2 p-2"
                      align="end"
                    >
                      <Button
                        variant={"ghost"}
                        onClick={() => navigateToPlaylist(playlist)}
                      >
                        <Play className="h-4 w-4" />
                        Play
                      </Button>
                      <Button
                        variant={"ghost"}
                        onClick={() =>
                          navigate(`/edit-playlist/${playlist._id}`, {
                            state: { playlist },
                          })
                        }
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Separator className="my-2" />
                      <Button
                        variant={"destructive"}
                        onClick={() => setPlaylistIdToDelete(playlist._id)}
                      >
                        <Trash className="h-4 w-4" /> Delete
                      </Button>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                {getVisibilityIcon(playlist.visibility)}
                <span className="ml-1 capitalize">{playlist.visibility}</span>
              </div>
              <div>Updated {dayjs(new Date(playlist.updatedAt)).from(now)}</div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div ref={channelPlaylistLoaderRef} className="text-center my-5">
        {channelPlaylistLoading && <Loader />}
      </div>

      {!channelPlaylistRes.hasNextPage &&
        (channelPlaylistRes.docs.length ? (
          <div className="text-center my-5 text-muted-foreground">
            No more playlists
          </div>
        ) : (
          <>
            <EmptyPlaylistTextSection
              isOwner={isOwner}
              selectedPlaylistVisibility={selectedPlaylistVisibility}
            />
          </>
        ))}

      <AlertDialog open={playlistIdToDelete !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this playlist?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              playlist from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleteInProgress}
              onClick={() => setPlaylistIdToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleteInProgress}
              onClick={handlePlaylistDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

type ChannelPlaylistsProps = {
  selectedPlaylistVisibility: "public" | "private" | "all";
  setSelectedPlaylistVisibility: React.Dispatch<
    React.SetStateAction<"public" | "private" | "all">
  >;

  channelPlaylistRes: AggregatedResponse<IPlaylist>;
  channelPlaylistErr: Error | undefined;
  channelPlaylistLoading: boolean;
  channelPlaylistLoaderRef: React.RefObject<HTMLDivElement>;

  isOwner: boolean;
  refreshChannelPlaylist: () => Promise<void>;
};

const ChannelPlaylists: React.FC<ChannelPlaylistsProps> = ({
  selectedPlaylistVisibility,
  setSelectedPlaylistVisibility,
  channelPlaylistRes,
  channelPlaylistLoading,
  channelPlaylistErr,
  channelPlaylistLoaderRef,
  isOwner,
  refreshChannelPlaylist,
}) => {
  const onVisibilityChangeChange = (
    value: "public" | "private" | "all"
  ): void => setSelectedPlaylistVisibility(value);

  return (
    <div>
      {isOwner && (
        <div className="flex items-center justify-end">
          <Select
            name="visibility"
            value={selectedPlaylistVisibility}
            onValueChange={onVisibilityChangeChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                className="cursor-pointer hover:bg-secondary"
                value="all"
              >
                All
              </SelectItem>
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
      )}

      <PlaylistResult
        channelPlaylistRes={channelPlaylistRes}
        channelPlaylistErr={channelPlaylistErr}
        channelPlaylistLoaderRef={channelPlaylistLoaderRef}
        channelPlaylistLoading={channelPlaylistLoading}
        refreshChannelPlaylist={refreshChannelPlaylist}
        selectedPlaylistVisibility={selectedPlaylistVisibility}
        isOwner={isOwner}
      />
    </div>
  );
};

export default ChannelPlaylists;
