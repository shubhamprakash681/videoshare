import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse } from "@/types/APIResponse";
import { IUser } from "@/types/collections";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/hooks/useStore";
import { updateUser } from "@/features/authSlice";
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

type UploadTCDialogProps = {
  isOpen: boolean;
  uploadTCAccepted: boolean;
  uploadBtnClicked: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadBtnClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenVideoUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const UploadTCDialog: React.FC<UploadTCDialogProps> = ({
  isOpen,
  uploadTCAccepted,
  uploadBtnClicked,
  setIsOpen,
  setOpenVideoUploadModal,
  setUploadBtnClicked,
}) => {
  const [accepted, setAccepted] = useState<boolean>(uploadTCAccepted);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showOptoutConfirmDialog, setShowOptoutConfirmDialog] =
    useState<boolean>(false);

  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const handleUploadTcToggle = async () => {
    setIsLoading(true);
    try {
      const { data } = await AxiosAPIInstance.put<APIResponse<{ user: IUser }>>(
        "/api/v1/user/terms"
      );

      if (data.success && data.data?.user) {
        dispatch(updateUser(data.data.user));

        setIsOpen(!data.data.user.uploadTCAccepted);

        if (data.data.user.uploadTCAccepted) {
          setOpenVideoUploadModal(uploadBtnClicked);
        } else {
          setOpenVideoUploadModal(false);
          setUploadBtnClicked(false);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title:
            error.response?.data.message ||
            "Failed to update terms and conditions acceptance!",
          variant: "destructive",
        });
      }

      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl max-h-dvh overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Videoshare Terms & Conditions</DialogTitle>
          <DialogDescription>
            Please read and accept our terms and conditions to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[300px] overflow-y-auto pr-2 text-sm">
          <h3 className="mb-2 font-medium">1. Introduction</h3>
          <p className="mb-4 text-muted-foreground">
            Welcome to VideoShare! In order to store videos at our platform, you
            agree to comply with and be bound by the following Terms and
            Conditions. Please read them carefully before using our services. If
            you do not agree to these terms, you won't be able to upload video
            at VideoShare.
          </p>

          <h3 className="mb-2 font-medium">
            2. Content Moderation and NSFW Policy
          </h3>
          <p className="mb-4 text-muted-foreground">
            All videos uploaded by users will be scanned{" "}
            <span className="text-primary bg-primary/15">frame by frame</span>{" "}
            for NSFW (Not Safe For Work) classification. Any video found to
            contain NSFW content, including but not limited to explicit sexual
            content, excessive violence, hate speech, or other inappropriate
            material will be removed. Repeated violations may result in account
            suspension or termination. We reserve the right to define what
            constitutes NSFW content at our sole discretion.
          </p>

          <h3 className="mb-2 font-medium">3. Acceptable use</h3>
          <p className="mb-2 text-muted-foreground">
            You agree not to upload, post, share, or otherwise distribute any
            content that is explicit, obscene, pornographic, sexually
            suggestive, or otherwise inappropriate. This includes, but is not
            limited to:
          </p>
          <ul className="mb-4 list-disc list-inside pl-6 space-y-1 text-muted-foreground">
            <li>Nudity or sexually explicit material.</li>
            <li>Content depicting violence, abuse, or exploitation.</li>
            <li>
              Content that promotes hate speech, discrimination, or harassment.
            </li>
            <li>Any material that violates applicable laws or regulations.</li>
          </ul>
        </div>

        <DialogFooter className="flex items-center justify-between pt-4 sm:justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I accept the terms and conditions
            </label>
          </div>

          {!uploadTCAccepted ? (
            <Button
              onClick={handleUploadTcToggle}
              disabled={!accepted || isLoading}
            >
              Accept & Continue
            </Button>
          ) : (
            <Button
              onClick={() => setShowOptoutConfirmDialog(true)}
              disabled={accepted || isLoading}
            >
              Opt out
            </Button>
          )}
        </DialogFooter>

        <OptOutConfirmDialog
          isOpen={showOptoutConfirmDialog}
          setIsOpen={setShowOptoutConfirmDialog}
          isLoading={isLoading}
          handleUploadTcToggle={handleUploadTcToggle}
        />
      </DialogContent>
    </Dialog>
  );
};

type OptOutConfirmDialogProps = {
  isOpen: boolean;
  isLoading: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUploadTcToggle: () => Promise<void>;
};
const OptOutConfirmDialog: React.FC<OptOutConfirmDialogProps> = ({
  isOpen,
  isLoading,
  setIsOpen,
  handleUploadTcToggle,
}) => {
  const handleOptOutConfirm = async () => {
    await handleUploadTcToggle();
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to opt out?</AlertDialogTitle>
          <AlertDialogDescription>
            Opting out means you will not be able to upload videos to
            VideoShare.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            disabled={isLoading}
            onClick={handleOptOutConfirm}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UploadTCDialog;
