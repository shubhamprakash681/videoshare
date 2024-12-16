import { VideoCard } from "@/components";
import PageContainer from "@/components/ui/PageContainer";
import { useAppSelector } from "@/hooks/useStore";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse, GetVideosResponse } from "@/types/APIResponse";
import { IVideo } from "@/types/collections";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

const Home: React.FC = () => {
  const navigate = useNavigate();
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
            onClick={() =>
              navigate(`/video/${video._id}`, {
                state: {
                  video,
                },
              })
            }
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default Home;
