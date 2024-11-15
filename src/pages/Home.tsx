import { VideoCard } from "@/components";
import PageContainer from "@/components/ui/PageContainer";
import { useAppSelector } from "@/hooks/useStore";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse } from "@/types/APIResponse";
import { IVideo } from "@/types/collections";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

interface GetVideosResponse {
  docs: IVideo[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
}

const Home: React.FC = () => {
  const now = dayjs();

  const { limit, page, query, sortBy, sortType } = useAppSelector(
    (state) => state.videoReducer
  );

  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await AxiosAPIInstance.get<APIResponse<GetVideosResponse>>(
        `/api/v1/video?page=${page}&limit=${limit}&query=${query}&sortBy=${sortBy}&sortType=${sortType}`
      );

      console.log("here, res: ", res);
      if (res.data.success && res.data.data?.docs) {
        setVideos(res.data.data?.docs);
      }
    };

    fetchVideos();
  }, []);
  return (
    <PageContainer>
      <div className="p-2 sm:p-3 md:p-4 lg:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-items-center gap-4">
        {videos.map((video: IVideo) => (
          <VideoCard
            key={video._id}
            title={video.title}
            createdAt={dayjs(new Date(video.createdAt)).from(now)}
            duration={video.duration}
            thumbnail={video.thumbnail.url}
            views={video.views}
            channelDetails={{
              channelAvatar: video.owner.avatar as unknown as string,
              channelName: video.owner.fullname,
            }}
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default Home;
