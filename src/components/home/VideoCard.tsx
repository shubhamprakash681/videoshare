import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatVideoDuration } from "@/lib/video";
import React from "react";

type VideoCardProps = {
  title: string;
  thumbnail: string;
  duration: number;
  views: number;
  createdAt: string;
  channelDetails: {
    channelName: string;
    channelAvatar: string;
  };
};

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  createdAt,
  duration,
  thumbnail,
  views,
  channelDetails,
}) => {
  return (
    <div className="w-full bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:shadow-gray-700/30">
      <div className="relative">
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {formatVideoDuration(duration)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Avatar className="h-8 w-8">
            <AvatarImage src={channelDetails.channelAvatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="font-medium">{channelDetails.channelName}</span>
        </div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <span>{views} views</span>
          <span>•</span>
          <span>{createdAt}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
