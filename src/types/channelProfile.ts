export interface QueryStates {
  channelVideosQuery: {
    page: number;
    limit: number;
  };
  channelPlaylistQuery: {
    page: number;
    limit: number;
    visibility: "public" | "private" | "all";
  };
}
