import { useToast } from "@/hooks/use-toast";
import { updateVideoSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { SubmitHandler, useForm, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import FormErrorStrip from "../ui/FormErrorStrip";
import RTE from "./RTE";
import { Button } from "../ui/button";
import { ImageIcon } from "lucide-react";
import { AxiosError } from "axios";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse } from "@/types/APIResponse";
import { IVideo } from "@/types/collections";

type VideoUpdateInputs = z.infer<typeof updateVideoSchema>;
interface UpdateVideoModalData {
  videoId: string | null;
  initialValues: VideoUpdateInputs | null;
}

type VideoUpdateDialogProps = {
  updateVideoModalData: UpdateVideoModalData;
  setUpdateVideoModalData: React.Dispatch<
    React.SetStateAction<UpdateVideoModalData>
  >;
  setVideoUploadModalDirty: React.Dispatch<React.SetStateAction<boolean>>;
};
const VideoUpdateDialog: React.FC<VideoUpdateDialogProps> = ({
  updateVideoModalData,
  setUpdateVideoModalData,
  setVideoUploadModalDirty,
}) => {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
    getValues,
    setValue,
    control,
  } = useForm<VideoUpdateInputs>({
    resolver: zodResolver(updateVideoSchema),
  });

  const onOpenChange = () => {
    if (updateVideoModalData.videoId) {
      setUpdateVideoModalData({ videoId: null, initialValues: null });
    }
  };

  const thumbnailPreview = watch("thumbnail");

  const videoUpdateHandler: SubmitHandler<VideoUpdateInputs> = async (
    data: VideoUpdateInputs
  ) => {
    try {
      const { data: videoUpdateResponse } = await AxiosAPIInstance.patch<
        APIResponse<{ video: IVideo }>
      >(
        `/api/v1/video/update/${updateVideoModalData.videoId}`,
        {
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail![0],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (videoUpdateResponse.success) {
        setVideoUploadModalDirty(true);
        setValue("title", "");
        setValue("description", "");
        setValue("thumbnail", undefined);

        setUpdateVideoModalData({ initialValues: null, videoId: null });

        toast({
          title: videoUpdateResponse.message,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Something went wrong!",
          variant: "destructive",
        });
      }

      console.error(error);
    }
  };

  useEffect(() => {
    if (updateVideoModalData.initialValues)
      setValue("title", updateVideoModalData.initialValues?.title);
    setValue(
      "description",
      updateVideoModalData.initialValues?.description || ""
    );
    setValue("thumbnail", updateVideoModalData.initialValues?.thumbnail);
  }, [updateVideoModalData.initialValues]);

  return (
    <Dialog
      open={updateVideoModalData.videoId !== null}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl max-h-dvh overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Video</DialogTitle>
          <DialogDescription>
            Update title, description and upload new thumbnail file
          </DialogDescription>
        </DialogHeader>

        <form
          id="video-update-form"
          onSubmit={handleSubmit(videoUpdateHandler)}
          className="space-y-4 flex flex-col"
        >
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0">
            <div className="w-full space-y-3 md:pr-2">
              <div className="grid w-full items-center gap-1">
                <Label htmlFor="title">Title:</Label>
                <Input
                  {...register("title")}
                  id="title"
                  type="text"
                  placeholder="Enter video title"
                />
                {errors.title && (
                  <FormErrorStrip
                    errorMessage={errors.title.message as string}
                  />
                )}
              </div>

              <div className="grid w-full items-center gap-1">
                {/* <Label htmlFor="description">Desciption:</Label> */}
                <RTE
                  label="Description:"
                  name="description"
                  defaultValue={getValues("description")}
                  control={control}
                />
                {errors.description && (
                  <FormErrorStrip
                    errorMessage={errors.description.message as string}
                  />
                )}
              </div>
            </div>

            <div className="w-full md:pl-2 space-y-3">
              <div className="grid w-full items-center gap-1">
                <Label htmlFor="thumbnail">Thumbnail:</Label>

                {thumbnailPreview && thumbnailPreview.length > 0 ? (
                  <div className="mt-2 relative group">
                    <img
                      src={URL.createObjectURL(thumbnailPreview[0])}
                      className="w-full rounded-lg object-cover"
                      alt="thumbnail"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ThumbnailInput
                        register={register}
                        buttonText="Change thumbnail"
                      />
                    </div>
                  </div>
                ) : (
                  <ThumbnailInput
                    register={register}
                    buttonText="Choose thumbnail file"
                  />
                )}

                {errors.thumbnail && (
                  <FormErrorStrip
                    errorMessage={errors.thumbnail.message as string}
                  />
                )}
              </div>
            </div>
          </div>

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VideoUpdateDialog;

type ThumbnailInputProps = {
  buttonText: string;
  register: UseFormRegister<VideoUpdateInputs>;
};
const ThumbnailInput: React.FC<ThumbnailInputProps> = ({
  buttonText,
  register,
}) => {
  return (
    <div className="relative">
      <input
        {...register("thumbnail")}
        id="thumbnail"
        type="file"
        accept="image/jpeg, image/png"
        className="hidden"
        multiple={false}
      />
      <Label
        htmlFor="thumbnail"
        className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <ImageIcon className="w-5 h-5 mr-2 text-gray-400" />
        {buttonText}
      </Label>
    </div>
  );
};
