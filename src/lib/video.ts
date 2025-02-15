export const formatVideoDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = (seconds % 60).toPrecision(2);

  if (hours > 0) {
    return `${hours}:${minutes}:${remainingSeconds}`;
  }
  return `${minutes}:${remainingSeconds}`;
};

export const formatCount = (count: number): string => {
  if (count < 1000) {
    return count.toString();
  } else if (count >= 1000 && count < 1000000) {
    return (count / 1000).toFixed(1) + "K";
  } else if (count >= 1000000 && count < 1000000000) {
    return (count / 1000000).toFixed(1) + "M";
  } else if (count >= 1000000000) {
    return (count / 1000000000).toFixed(1) + "B";
  }
  return count.toString();
};

export const formatSearchText = (text: string): string => {
  return text
    .split(".")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(".");
};
