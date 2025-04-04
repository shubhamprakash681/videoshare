import { AggregatedResponse } from "@/types/APIResponse";
import { Subscription } from "@/types/collections";
import React from "react";
import ErrorStateComp from "../ui/ErrorStateComp";
import Loader from "../ui/Loader";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Image from "../ui/Image";
import VideoCard from "../home/VideoCard";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend Day.js with the relativeTime plugin
dayjs.extend(relativeTime);

interface ChannelSubscriptionsProps {
  channelSubscriptionRes: AggregatedResponse<Subscription>;
  channelSubscriptionErr: Error | undefined;
  channelSubscriptionLoading: boolean;
  channelSubscriptionLoaderRef: React.RefObject<HTMLDivElement>;
  refreshChannelSubscription: () => Promise<void>;
}

const ChannelSubscriptions: React.FC<ChannelSubscriptionsProps> = ({
  channelSubscriptionErr,
  channelSubscriptionLoaderRef,
  channelSubscriptionLoading,
  channelSubscriptionRes,
  refreshChannelSubscription,
}) => {
  if (channelSubscriptionErr)
    return <ErrorStateComp handleRefresh={refreshChannelSubscription} />;

  const now = dayjs();
  const navigate = useNavigate();

  return (
    <>
      <div className="p-2 sm:p-3 md:p-4 lg:p-6">
        {channelSubscriptionRes.docs.map((subscription) => (
          <Card
            key={subscription._id}
            className="w-full min-w-full overflow-hidden shadow-lg transition-all duration-300 hover:scale-[101%] mb-3"
          >
            <CardHeader className="p-0 border-b dark:border-b-gray-700">
              <Link to={`/${subscription.channel.username}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 p-3">
                      <Image
                        src={subscription.channel.avatar.url}
                        alt={subscription.channel.username}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-primary">
                          {subscription.channel.fullname}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{subscription.channel.username}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="link"
                    className="h-full transition duration-150 ease-linear hover:scale-[101%] group"
                  >
                    <ArrowRight className="h-4 w-4 transition duration-150 ease-linear group-hover:translate-x-1" />
                  </Button>
                </div>
              </Link>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              <h2 className="font-semibold text-secondary-foreground">
                Recent Videos
              </h2>

              <div className="flex items-center overflow-x-auto">
                {subscription.channel.recentVideos.length ? (
                  subscription.channel.recentVideos.map((video) => (
                    <div key={video._id} className="w-96 min-w-80 p-2">
                      <VideoCard
                        title={video.title}
                        createdAt={dayjs(new Date(video.createdAt)).from(now)}
                        duration={video.duration}
                        thumbnail={video.thumbnail.url}
                        views={video.views}
                        channelDetails={{
                          channelAvatar: video.owner
                            .avatar as unknown as string,
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
                    </div>
                  ))
                ) : (
                  <div className="w-full h-20 flex items-center justify-center text-muted-foreground">
                    This Channel has no video yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div ref={channelSubscriptionLoaderRef} className="text-center my-5">
        {channelSubscriptionLoading && <Loader />}
      </div>

      {!channelSubscriptionRes.hasNextPage &&
        (channelSubscriptionRes.docs.length ? (
          <div className="text-center my-5 text-muted-foreground">
            No more subscriptions
          </div>
        ) : (
          <div className="w-full h-56 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <p>This channel has no subscription yet.</p>
            <p>
              You can subscribe to it by clicking the "Subscribe" button on the
              channel's profile page.
            </p>
          </div>
        ))}
    </>
  );
};

export default ChannelSubscriptions;
