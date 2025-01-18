import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Bookmark, BookmarkCheck, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse } from "@/types/APIResponse";
import { PlaylistOptions } from "@/types/collections";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "../ui/checkbox";
import Loader from "../ui/Loader";
import { Separator } from "../ui/separator";
import NewPlaylistModal from "./NewPlaylistModal";

type AddPlaylistModalProps = {
  videoId: string;
  videoTitle: string;
};

const AddPlaylistModal: React.FC<AddPlaylistModalProps> = ({
  videoId,
  videoTitle,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<{
    playlistOptions: boolean;
    savePlaylist: boolean;
  }>({
    playlistOptions: false,
    savePlaylist: false,
  });

  const [playlistOptions, setPlaylistOptions] = useState<PlaylistOptions[]>([]);
  const [playlistsIdsToSave, setPlaylistsIdsToSave] = useState<string[]>([]);
  const [playlistsIdsToRemove, setPlaylistsIdsToRemove] = useState<string[]>(
    []
  );

  const handlePlaylistChange = (playlistId: string, checked: boolean) => {
    if (checked) {
      setPlaylistsIdsToSave([...playlistsIdsToSave, playlistId]);
      setPlaylistsIdsToRemove(
        playlistsIdsToRemove.filter((id) => id !== playlistId)
      );
    } else {
      setPlaylistsIdsToRemove([...playlistsIdsToRemove, playlistId]);
      setPlaylistsIdsToSave(
        playlistsIdsToSave.filter((id) => id !== playlistId)
      );
    }
  };

  const fetchPlaylistOptions = async () => {
    try {
      setIsLoading({ ...isLoading, playlistOptions: true });

      const { data } = await AxiosAPIInstance.get<
        APIResponse<PlaylistOptions[]>
      >(`/api/v1/playlist/options/${videoId}`);

      if (data.success && data.data) {
        setPlaylistsIdsToSave([]);
        setPlaylistsIdsToRemove([]);
        setPlaylistOptions(data.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title:
            error.response?.data.message || "Failed to fetch Playlist options",
          variant: "destructive",
        });
      }

      setPlaylistOptions([]);
      console.error(error);
    } finally {
      setIsLoading({ ...isLoading, playlistOptions: false });
    }
  };

  const saveHandler = async () => {
    if (!playlistsIdsToSave.length && !playlistsIdsToRemove.length) return;

    try {
      setIsLoading({ ...isLoading, savePlaylist: true });

      const { data } = await AxiosAPIInstance.patch<APIResponse<null>>(
        `/api/v1/video/playlist/${videoId}`,
        {
          addToPlaylistIds: playlistsIdsToSave,
          removeFromPlaylistIds: playlistsIdsToRemove,
        }
      );

      if (data.success) {
        toast({
          title: data.message || "Playlists updated successfully",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to updated playlists",
          variant: "destructive",
        });
      }

      console.error(error);
    } finally {
      setIsLoading({ ...isLoading, savePlaylist: false });
      fetchPlaylistOptions();
    }
  };

  useEffect(() => {
    fetchPlaylistOptions();
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={
            playlistOptions.some((playlist) => playlist.isPresent)
              ? "secondary"
              : "outline"
          }
          className="flex items-center"
        >
          {playlistOptions.some((playlist) => playlist.isPresent) ? (
            <>
              <BookmarkCheck className="h-4 w-4" />
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" />
            </>
          )}
          <span>Add to Playlist</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-md min-w-fit p-2 sm:p-3 md:p-4 lg:p-5">
        <AlertDialogHeader className="space-y-0">
          <AlertDialogTitle className="flex items-center justify-between">
            <span>Save to Playlist</span>
            <AlertDialogCancel className="p-2 rounded-full border-none shadow-none mt-0">
              <X className="h-4 w-4" />
            </AlertDialogCancel>
          </AlertDialogTitle>

          <AlertDialogDescription className="text-start">
            Select the playlists you want to add "
            <span className="font-semibold">{videoTitle}</span>" to
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 max-h-40 overflow-y-auto">
          {isLoading.playlistOptions ? (
            <Loader color="secondary" size="small" />
          ) : (
            <>
              {playlistOptions.length ? (
                <>
                  {playlistOptions.map((playlist) => (
                    <div
                      key={playlist._id}
                      className="relative flex items-center justify-start h-fit min-h-fit rounded-md hover:bg-secondary"
                    >
                      <Checkbox
                        className="absolute left-4"
                        id={`playlist-${playlist._id}`}
                        disabled={isLoading.savePlaylist}
                        checked={
                          (playlist.isPresent ||
                            playlistsIdsToSave.includes(playlist._id)) &&
                          !playlistsIdsToRemove.includes(playlist._id)
                        }
                      />
                      <label
                        className="w-full h-full cursor-pointer py-2 pl-12 pr-4"
                        htmlFor={`playlist-${playlist._id}`}
                        onClick={() => {
                          const currVal =
                            (playlist.isPresent ||
                              playlistsIdsToSave.includes(playlist._id)) &&
                            !playlistsIdsToRemove.includes(playlist._id);

                          handlePlaylistChange(playlist._id, !currVal);
                        }}
                      >
                        {playlist.title} ({playlist.videos.length} videos)
                      </label>
                    </div>
                  ))}

                  <Separator className="mt-2" />

                  <NewPlaylistModal
                    triggerBtnVariant="secondary"
                    videoTitle={videoTitle}
                    videoId={videoId}
                    fetchPlaylistOptions={fetchPlaylistOptions}
                  />
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center h-20 text-muted-foreground">
                    <div>No Playlist available</div>
                    <div>Create a new Playlist to proceed.</div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <AlertDialogFooter>
          {playlistOptions.length ? (
            <>
              <AlertDialogCancel disabled={isLoading.savePlaylist}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isLoading.savePlaylist}
                onClick={saveHandler}
              >
                Save
              </AlertDialogAction>
            </>
          ) : (
            <NewPlaylistModal
              triggerBtnVariant="default"
              videoTitle={videoTitle}
              videoId={videoId}
              fetchPlaylistOptions={fetchPlaylistOptions}
            />
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddPlaylistModal;
