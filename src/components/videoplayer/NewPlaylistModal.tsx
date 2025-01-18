import React, { useEffect, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { createPlaylistSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import FormErrorStrip from "../ui/FormErrorStrip";
import BundledEditor from "../ui/rte/BundledEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAppDispatch } from "@/hooks/useStore";
import { setPreventCustomKeyPress } from "@/features/uiSlice";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse } from "@/types/APIResponse";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

type PlaylistInputs = z.infer<typeof createPlaylistSchema>;

type NewPlaylistModalProps = {
  triggerBtnVariant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  videoTitle: string;
  videoId: string;
  fetchPlaylistOptions: () => Promise<void>;
};

const NewPlaylistModal: React.FC<NewPlaylistModalProps> = ({
  triggerBtnVariant,
  videoTitle,
  videoId,
  fetchPlaylistOptions,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { isSubmitting, errors },
  } = useForm<PlaylistInputs>({
    defaultValues: {
      title: "",
      description: "",
      visibility: "private",
      videos: [videoId],
    },
    resolver: zodResolver(createPlaylistSchema),
  });

  const createPlaylistHandler: SubmitHandler<PlaylistInputs> = async (
    data: PlaylistInputs
  ) => {
    try {
      const { data: newPlaylistRes } = await AxiosAPIInstance.post<
        APIResponse<null>
      >("/api/v1/playlist", {
        title: data.title,
        visibility: data.visibility,
        description: data.description,
        videos: data.videos,
      });

      if (newPlaylistRes.success) {
        toast({
          title: newPlaylistRes.message,
        });

        await fetchPlaylistOptions();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to create Playlist",
          variant: "destructive",
        });
      }

      console.error(error);
    } finally {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(setPreventCustomKeyPress(true));
    } else {
      dispatch(setPreventCustomKeyPress(false));
    }
  }, [isOpen]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={triggerBtnVariant}
          className="w-full flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Playlist</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-md min-w-fit p-2 sm:p-3 md:p-4 lg:p-5">
        <AlertDialogHeader className="space-y-0">
          <AlertDialogTitle className="flex items-center justify-between">
            <span>Create a new Playlist</span>
            <AlertDialogCancel className="p-2 rounded-full border-none shadow-none mt-0">
              <X className="h-4 w-4" />
            </AlertDialogCancel>
          </AlertDialogTitle>

          <AlertDialogDescription className="text-start">
            Create a new playlists and add "
            <span className="font-semibold">{videoTitle}</span>" to
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          id="create-playlist-modal-form"
          onSubmit={handleSubmit(createPlaylistHandler)}
          className="space-y-4 flex flex-col"
        >
          <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:space-x-4 sm:space-y-0">
            <div className="grid sm:w-4/6 items-center gap-1">
              <Label htmlFor="title">Playlist Title:</Label>
              <Input
                {...register("title")}
                id="title"
                type="text"
                placeholder="Enter playlist title"
              />
              {errors.title && (
                <FormErrorStrip errorMessage={errors.title.message as string} />
              )}
            </div>

            <div className="grid items-center gap-1 mt-0 sm:w-2/6">
              <Label htmlFor="title">Playlist Visibility:</Label>

              <Controller
                name="visibility"
                control={control}
                render={({ field: { onChange } }) => (
                  <Select
                    name="visibility"
                    value={getValues("visibility")}
                    onValueChange={onChange}
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
                )}
              />

              {errors.visibility && (
                <FormErrorStrip
                  errorMessage={errors.visibility.message as string}
                />
              )}
            </div>
          </div>

          <div className="grid w-full items-center gap-1">
            <Label htmlFor="description">Playlist Desciption:</Label>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => {
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

                return (
                  <BundledEditor
                    id="description"
                    value={value}
                    onEditorChange={onChange}
                    init={editorInitConfig} // Prevent config changes from re-mounting
                  />
                );
              }}
            />
            {errors.description && (
              <FormErrorStrip
                errorMessage={errors.description.message as string}
              />
            )}
          </div>

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewPlaylistModal;
