import { SubmitHandler, useForm, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { uploadVideoSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import FormErrorStrip from "../ui/FormErrorStrip";
import RTE from "./RTE";
import { ImageIcon, VideoIcon } from "lucide-react";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse } from "@/types/APIResponse";
import { IVideo } from "@/types/collections";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import Image from "../ui/Image";
import { useEffect, useMemo } from "react";

type VideoUploadDialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setVideoUploadModalDirty: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenUploadTCDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

type VideoUploadInputs = z.infer<typeof uploadVideoSchema>;
const VideoUploadDialog: React.FC<VideoUploadDialogProps> = ({
  isOpen,
  setIsOpen,
  setVideoUploadModalDirty,
  setOpenUploadTCDialog,
}) => {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
    getValues,
    setValue,
    clearErrors,
    control,
  } = useForm<VideoUploadInputs>({
    defaultValues: {
      title: "",
      description: "",
      thumbnail: undefined,
      videoFile: undefined,
    },
    resolver: zodResolver(uploadVideoSchema),
  });

  const videoUploadHandler: SubmitHandler<VideoUploadInputs> = async (
    data: VideoUploadInputs
  ) => {
    try {
      const { data: videoUploadResponse } = await AxiosAPIInstance.post<
        APIResponse<{ video: IVideo }>
      >(
        "/api/v1/video/upload",
        {
          title: data.title,
          description: data.description,
          video: data.videoFile![0],
          thumbnail: data.thumbnail![0],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (videoUploadResponse.success) {
        setVideoUploadModalDirty(true);
        setValue("title", "");
        setValue("description", "");
        setValue("thumbnail", undefined);
        setValue("videoFile", undefined);

        clearErrors("title");
        clearErrors("description");
        clearErrors("thumbnail");
        clearErrors("videoFile");
        clearErrors("root");

        toast({
          title: videoUploadResponse.message,
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

  const thumbnailPreview = watch("thumbnail");
  const videoPreview = watch("videoFile");
  const descriptionDefaultValue = useMemo(() => getValues("description"), []);

  const videoPreviewUrl = useMemo(() => {
    return videoPreview && videoPreview.length > 0
      ? URL.createObjectURL(videoPreview[0])
      : null;
  }, [videoPreview]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const thumbnailPreviewUrl = useMemo(() => {
    return thumbnailPreview && thumbnailPreview.length > 0
      ? URL.createObjectURL(thumbnailPreview[0])
      : null;
  }, [thumbnailPreview]);

  useEffect(() => {
    return () => {
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
      }
    };
  }, [thumbnailPreviewUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl overflow-y-auto"
        style={{ maxHeight: "85dvh" }}
      >
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogDescription>
            Upload your video file, add a thumbnail, title, and description.
          </DialogDescription>
        </DialogHeader>

        <form
          id="video-upload-dialog-form"
          onSubmit={handleSubmit(videoUploadHandler)}
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
                  defaultValue={descriptionDefaultValue}
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
                <Label htmlFor="videoFile">Video File:</Label>
                <div className="relative">
                  <input
                    {...register("videoFile")}
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    multiple={false}
                  />
                  <Label
                    htmlFor="videoFile"
                    className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <VideoIcon className="w-5 h-5 mr-2 text-gray-400" />
                    {videoPreview && videoPreview.length
                      ? videoPreview[0].name
                      : "Choose video file"}
                  </Label>
                </div>
                {errors.videoFile && (
                  <FormErrorStrip
                    errorMessage={errors.videoFile.message as string}
                  />
                )}
                {videoPreviewUrl && (
                  <div className="mt-2">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="grid w-full items-center gap-1">
                <Label htmlFor="thumbnail">Thumbnail:</Label>

                {thumbnailPreviewUrl ? (
                  <div className="mt-2 relative group">
                    <Image
                      loaderSize="medium"
                      src={thumbnailPreviewUrl}
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

          <Button
            type="button"
            variant="outline"
            className="w-full mt-4 mb-2"
            onClick={() => setOpenUploadTCDialog(true)}
          >
            Review Terms & Conditions
          </Button>

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadDialog;

type ThumbnailInputProps = {
  buttonText: string;
  register: UseFormRegister<VideoUploadInputs>;
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
