// TopSearches.tsx
import React, { useEffect } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { formatCount, formatSearchText } from "@/lib/video";
import { TrendingUp } from "lucide-react";

interface TopSearchesProps {
  suggestionLength: number;
  selectedOptionIndex: number;
  setTopSearchLength: React.Dispatch<React.SetStateAction<number>>;
}

const TopSearches: React.FC<TopSearchesProps> = ({
  suggestionLength,
  selectedOptionIndex,
  setTopSearchLength,
}) => {
  const { topSearches } = useAppSelector((state) => state.videoReducer);

  useEffect(() => {
    setTopSearchLength(topSearches.length);
  }, [topSearches.length]);

  return (
    <>
      <div className="text-gray-500 text-xs">Top Searches</div>
      {topSearches.map((searchContent, index) => (
        <div
          key={searchContent._id}
          ref={(el) => {
            if (index + suggestionLength === selectedOptionIndex) {
              el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }}
          className={`py-1 px-1 sm:px-2 rounded-md flex items-center justify-start cursor-pointer hover:bg-secondary text-sm gap-2 my-1 ${
            selectedOptionIndex === index + suggestionLength && "bg-secondary"
          }`}
        >
          <TrendingUp className="h-4 w-4 min-w-4 text-muted-foreground" />
          <div className="w-full flex items-center justify-between">
            <span className="max-w-full text-ellipsis whitespace-nowrap overflow-hidden">
              {formatSearchText(searchContent.searchText)}
            </span>
            <span className="text-xs bg-green-300 dark:bg-green-800 flex items-center px-1 min-w-fit">
              {formatCount(searchContent.count)} Searches
            </span>
          </div>
        </div>
      ))}
      <div className="mb-2" />
    </>
  );
};

export default TopSearches;
