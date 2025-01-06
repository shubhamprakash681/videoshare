import { GetPlaylistResponse } from "@/types/APIResponse";
import React from "react";

type ChannelPlaylistsProps = {
  channelPlaylistRes: GetPlaylistResponse;
};

const ChannelPlaylists: React.FC<ChannelPlaylistsProps> = ({
  channelPlaylistRes,
}) => {
  return <div>ChannelPlaylists</div>;
};

export default ChannelPlaylists;
