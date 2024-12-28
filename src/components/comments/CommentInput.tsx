import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useAppDispatch } from "@/hooks/useStore";
import { setPreventCustomKeyPress } from "@/features/uiSlice";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse } from "@/types/APIResponse";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

type CommentInputProps = {
  isInputFocusedByDefault: boolean;
  userAvatarUrl: string;
  refreshVideoComments: () => Promise<void>;

  videoId: string;
  parentCommentId?: string;

  isUpdate?: boolean;
  initialCommentText?: string;
  updateCommentId?: string;
  setIsEditingComment?: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentInput: React.FC<CommentInputProps> = ({
  isInputFocusedByDefault,
  userAvatarUrl,
  videoId,
  parentCommentId,
  refreshVideoComments,
  isUpdate,
  initialCommentText,
  updateCommentId,
  setIsEditingComment,
}) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const commentTextRef = useRef<HTMLInputElement>(null);
  const [commentText, setCommentText] = useState<string>(
    initialCommentText ?? ""
  );
  const [isInputFocused, setIsInputFocused] = useState<boolean>(
    isInputFocusedByDefault
  );

  const [isCommenting, setIsCommenting] = useState<boolean>(false);

  const handleCommentSubmit = async () => {
    if (!commentText.length) return;

    try {
      setIsCommenting(true);

      // Make API request to comment
      const { data } = await AxiosAPIInstance.post<APIResponse<null>>(
        `/api/v1/comment/${videoId}`,
        {
          content: commentText,
          parentCommentId,
        }
      );

      if (data.success) {
        setCommentText("");
        toast({
          title: data.message,
        });

        refreshVideoComments();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to add comment",
          variant: "destructive",
        });
      }

      console.error(error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleCommentUpdate = async () => {
    if (!commentText.length) return;

    try {
      setIsCommenting(true);

      const { data } = await AxiosAPIInstance.patch<APIResponse<null>>(
        `/api/v1/comment/${updateCommentId}`,
        {
          content: commentText,
        }
      );

      if (data.success) {
        toast({
          title: data.message,
        });

        setIsEditingComment?.(false);
        refreshVideoComments();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to update comment",
          variant: "destructive",
        });
      }

      console.error(error);
    } finally {
      setIsCommenting(false);
    }
  };

  const onCancel = () => {
    setIsInputFocused(false);

    setIsEditingComment?.(false);
  };

  useEffect(() => {
    if (isInputFocusedByDefault) {
      commentTextRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (isInputFocused) {
      dispatch(setPreventCustomKeyPress(true));
    } else {
      dispatch(setPreventCustomKeyPress(false));
    }
  }, [isInputFocused]);

  return (
    <div className="flex items-center gap-x-2 mt-2">
      <Avatar>
        <AvatarImage src={userAvatarUrl} alt="AC" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>

      <div className="h-full w-full">
        <input
          ref={commentTextRef}
          onFocus={() => setIsInputFocused(true)}
          type="text"
          placeholder="Add a public comment..."
          className={`w-full px-3 py-2 ${
            isInputFocused
              ? "bg-input rounded-lg"
              : "bg-transparent border-b-2 border-gray-200 dark:border-gray-800"
          }`}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />

        <div className="h-10 flex justify-between items-center mt-2">
          {isInputFocused && (
            <>
              <div>Emoji</div>

              <div className="flex gap-2">
                <Button
                  onClick={onCancel}
                  variant="outline"
                  disabled={isCommenting}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!commentText.length || isCommenting}
                  onClick={isUpdate ? handleCommentUpdate : handleCommentSubmit}
                >
                  {isUpdate ? "Update" : "Comment"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
