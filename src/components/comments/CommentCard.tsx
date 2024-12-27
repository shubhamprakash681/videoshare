import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { APIResponse, VideoCommentData } from "@/types/APIResponse";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import dayjs from "dayjs";
import { formatCount } from "@/lib/video";
import { ChevronDown, ChevronUp, ThumbsDown, ThumbsUp } from "lucide-react";
import CommentInput from "./CommentInput";
import { useAppSelector } from "@/hooks/useStore";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

type CommentCardProps = {
  commentData: VideoCommentData;
  currTimestamp: dayjs.Dayjs;
  videoId: string;

  refreshVideoComments: () => Promise<void>;
  parentCommentId?: string;
};

const CommentCard: React.FC<CommentCardProps> = ({
  commentData,
  currTimestamp,
  videoId,
  refreshVideoComments,
  parentCommentId,
}) => {
  const { userData } = useAppSelector((state) => state.authReducer);
  const { toast } = useToast();

  const [isRepliesVisible, setIsRepliesVisible] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const toggleCommentLike = async () => {
    try {
      setIsLiking(true);

      const { data } = await AxiosAPIInstance.post<APIResponse<null>>(
        `/api/v1/like/comment/${commentData._id}?likeType=${
          commentData.isLiked ? "delete" : "like"
        }`
      );

      if (data.success) {
        toast({
          title: data.message,
        });
        refreshVideoComments();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to like comment",
          variant: "destructive",
        });
      }

      console.error(error);
    } finally {
      setIsLiking(false);
    }
  };

  const toggleCommentDislike = async () => {
    try {
      setIsLiking(true);

      const { data } = await AxiosAPIInstance.post<APIResponse<null>>(
        `/api/v1/like/comment/${commentData._id}?likeType=${
          commentData.isDisliked ? "delete" : "dislike"
        }`
      );

      if (data.success) {
        toast({
          title: data.message,
        });
        refreshVideoComments();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to dislike comment",
          variant: "destructive",
        });
      }

      console.error(error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="flex items-start gap-x-2 my-4">
      <Avatar>
        <AvatarImage src={commentData.owner.avatar} alt="AC" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>

      <div className="w-full">
        <div className="flex items-center">
          <Link to={commentData.owner.username}>
            <Button className="px-1 py-0 h-fit" variant={"ghost"}>
              @{commentData.owner.username}
            </Button>
          </Link>

          <span className="pl-1 text-xs">
            {dayjs(commentData.updatedAt).from(currTimestamp)}
          </span>
          <span className="pl-1 text-xs">
            {commentData.updatedAt !== commentData.createdAt && "(edited)"}
          </span>
        </div>

        <div className="py-1">
          <p className="text-sm">{commentData.content}</p>
        </div>

        <div className="flex items-center">
          <Button
            variant={"ghost"}
            className="flex items-center p-2 rounded-full"
            onClick={toggleCommentLike}
            disabled={isLiking}
          >
            <ThumbsUp
              className={`h-4 w-4 ${commentData?.isLiked && "fill-current"}`}
            />
          </Button>
          <span className="mr-3">
            {formatCount(commentData?.totalLikesCount ?? 0)}
          </span>

          <Button
            variant={"ghost"}
            className="flex items-center p-2 rounded-full"
            onClick={toggleCommentDislike}
            disabled={isLiking}
          >
            <ThumbsDown
              className={`h-4 w-4 ${commentData?.isDisliked && "fill-current"}`}
            />
          </Button>

          <Button
            variant={isReplying ? "secondary" : "ghost"}
            className="flex items-center p-2 rounded-full ml-2"
            onClick={() => setIsReplying(!isReplying)}
          >
            Reply
          </Button>
        </div>

        {isReplying && (
          <CommentInput
            isInputFocusedByDefault={true}
            userAvatarUrl={userData?.avatar.url || ""}
            videoId={videoId}
            parentCommentId={parentCommentId ?? commentData._id}
            refreshVideoComments={refreshVideoComments}
          />
        )}

        {commentData.replies && commentData.replies.length > 0 && (
          <>
            <div>
              <Button
                variant={"ghost"}
                className="flex items-center p-2 rounded-full bg-purple-100 dark:bg-purple-900"
                onClick={() => setIsRepliesVisible(!isRepliesVisible)}
              >
                {isRepliesVisible ? <ChevronUp /> : <ChevronDown />}
                {commentData.replies.length}
                {commentData.replies.length > 1 ? " Replies" : " Reply"}
              </Button>
            </div>

            {isRepliesVisible && (
              <div>
                {commentData.replies.map((reply) => (
                  <CommentCard
                    key={reply._id}
                    commentData={reply}
                    currTimestamp={currTimestamp}
                    refreshVideoComments={refreshVideoComments}
                    videoId={videoId}
                    parentCommentId={commentData._id}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
