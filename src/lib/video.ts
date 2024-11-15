export const formatVideoDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = (seconds % 60).toPrecision(2);

  if (hours > 0) {
    return `${hours}:${minutes}:${remainingSeconds}`;
  }
  return `${minutes}:${remainingSeconds}`;
};
