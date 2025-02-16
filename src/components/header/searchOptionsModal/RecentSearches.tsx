import React, { useEffect } from "react";
import { Clock } from "lucide-react";
import { formatSearchText } from "@/lib/video";
import { useRecentSearches } from "./hooks/useRecentSearches";

interface RecentSearchesProps {
  suggestionLength: number;
  topSearchLength: number;
  selectedOptionIndex: number;
  setRecentSearchLength: React.Dispatch<React.SetStateAction<number>>;
  handleOptionClick: (selectedOption: string) => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  suggestionLength,
  topSearchLength,
  selectedOptionIndex,
  setRecentSearchLength,
  handleOptionClick,
}) => {
  const recentSearches = useRecentSearches();

  useEffect(() => {
    setRecentSearchLength(recentSearches.length);
  }, [recentSearches.length]);

  if (!recentSearches.length) return null;

  return (
    <>
      <div className="text-gray-500 text-xs">Recent Searches</div>
      {recentSearches.map((searchContent, index) => (
        <div
          key={`recent-${searchContent}-${index}`}
          ref={(el) => {
            if (
              index + suggestionLength + topSearchLength ===
              selectedOptionIndex
            ) {
              el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }}
          className={`py-1 px-1 sm:px-2 rounded-md flex items-center justify-start cursor-pointer hover:bg-secondary text-sm gap-2 ${
            selectedOptionIndex ===
              index + suggestionLength + topSearchLength && "bg-secondary"
          }`}
          onClick={() => handleOptionClick(searchContent)}
        >
          <Clock className="h-4 w-4 min-w-4 text-muted-foreground" />
          <span className="max-w-full text-ellipsis whitespace-nowrap overflow-hidden">
            {formatSearchText(searchContent)}
          </span>
        </div>
      ))}
    </>
  );
};

export default RecentSearches;
