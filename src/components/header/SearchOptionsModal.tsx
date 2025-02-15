import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { useAppSelector } from "@/hooks/useStore";
import { formatCount } from "@/lib/video";
import { APIResponse, SearchSuggestions } from "@/types/APIResponse";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import sanitizeHtml from "sanitize-html";
import useSanitizedHTML from "@/hooks/useSanitizedHTML";
import { Button } from "../ui/button";
import { Clock, ListVideo, TrendingUp } from "lucide-react";

// function for removing extra charcters that left after sanitizing description highlights
const removeIncompleteTags = (sanitizedHtml: string) => {
  const allTags = sanitizeHtml.defaults.allowedTags;
  const allLtTags = allTags.map((tg) => `&lt;${tg}`).concat("&lt;");
  const allGtTags = allTags.map((tg) => `${tg}&gt;`).concat("&gt;");

  allLtTags.forEach((tg) => (sanitizedHtml = sanitizedHtml.replace(tg, "")));
  allGtTags.forEach((tg) => (sanitizedHtml = sanitizedHtml.replace(tg, "")));

  return sanitizedHtml;
};

const formatSearchText = (text: string): string => {
  return text
    .split(".")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(".");
};

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
            if (selectedOptionIndex === index + suggestionLength) {
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

interface RecentSearchesProps {
  suggestionLength: number;
  topSearchLength: number;
  selectedOptionIndex: number;
  setRecentSearchLength: React.Dispatch<React.SetStateAction<number>>;
}
const RecentSearches: React.FC<RecentSearchesProps> = ({
  suggestionLength,
  topSearchLength,
  selectedOptionIndex,
  setRecentSearchLength,
}) => {
  const recentSearches: string[] = JSON.parse(
    localStorage.getItem("videoshare-recent-searches") || "[]"
  );

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
              selectedOptionIndex ===
              index + suggestionLength + topSearchLength
            ) {
              el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }}
          className={`py-1 px-1 sm:px-2 rounded-md flex items-center justify-start cursor-pointer hover:bg-secondary text-sm gap-2 ${
            selectedOptionIndex ===
              index + suggestionLength + topSearchLength && "bg-secondary"
          }`}
        >
          <Clock className="h-4 w-4 min-w-4 text-muted-foreground" />

          <span className="max-w-full text-ellipsis whitespace-nowrap overflow-hidden">
            {formatSearchText(searchContent)}
          </span>
        </div>
      ))}

      {/* <div className="mb-2" /> */}
    </>
  );
};

interface HighlightedSearchProps {
  highlights: {
    score: number;
    path: "description" | "title";
    texts: {
      value: string;
      type: "text" | "hit";
    }[];
  };
}
const HighlightedSearch: React.FC<HighlightedSearchProps> = ({
  highlights,
}) => {
  const { sanitizeHTMLContent } = useSanitizedHTML();

  if (highlights?.path === "description") {
    return (
      <>
        {highlights?.texts.map((segment, index) => (
          <span
            key={`search-${highlights?.path}-${segment.value}-${index}`}
            className={`${
              segment.type === "hit" ? "bg-green-300 dark:bg-green-800" : ""
            } `}
          >
            {removeIncompleteTags(
              sanitizeHTMLContent(segment.value, { allowedTags: [] })
            )}
          </span>
        ))}
      </>
    );
  }

  return (
    <>
      {highlights?.texts.map((segment, index) => (
        <span
          key={`search-${highlights?.path}-${segment.value}-${index}`}
          className={`${
            segment.type === "hit" ? "bg-green-300 dark:bg-green-800" : ""
          } `}
        >
          {segment.value}
        </span>
      ))}
    </>
  );
};

interface SuggestionsProps {
  selectedOptionIndex: number;
  setSuggestionLength: React.Dispatch<React.SetStateAction<number>>;
}
const Suggestions: React.FC<SuggestionsProps> = ({
  selectedOptionIndex,
  setSuggestionLength,
}) => {
  const { searchKey } = useAppSelector((state) => state.videoReducer);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState<SearchSuggestions[]>([]);

  const { toast } = useToast();

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery && searchQuery.length) {
      try {
        setIsLoading(true);

        const { data } = await AxiosAPIInstance.get<
          APIResponse<SearchSuggestions[]>
        >(`/api/v1/video/search/suggestions?query=${searchQuery}`);

        if (data.success && data.data) {
          setSuggestions(data.data);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title:
              error.response?.data.message || "Failed to fetch Search Results",
            variant: "destructive",
          });
        }

        setSuggestions([]);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    setSuggestionLength(suggestions.length);
  }, [suggestions.length]);

  useEffect(() => {
    fetchSuggestions(searchKey);
  }, [searchKey]);

  if (!suggestions.length) return null;

  const SuggestionContainer: React.FC<{
    suggestion: SearchSuggestions;
    path: "description" | "title";
  }> = ({ suggestion, path }) => {
    const highlightIndex = suggestion.highlights.findIndex(
      (highlight) => highlight.path === path
    );

    if (highlightIndex === -1) {
      return suggestion.title;
    }

    return (
      <HighlightedSearch highlights={suggestion.highlights[highlightIndex]} />
    );
  };

  return (
    <>
      <div className="text-gray-500 text-xs">Top Results</div>

      {suggestions.map((suggestion, index) => (
        <Button
          key={`${suggestion.title}-${index}`}
          ref={(el) => {
            if (index === selectedOptionIndex) {
              el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }}
          className={`py-1 px-1 sm:px-2 rounded-md w-full min-h-fit flex items-center justify-start gap-1 my-1 bg-red ${
            index === selectedOptionIndex && "bg-secondary"
          }`}
          variant={"outline"}
          disabled={isLoading}
        >
          <ListVideo className="h-4 w-4 min-w-4 text-muted-foreground" />

          <div className="w-full flex flex-col items-start gap-1">
            <div className="text-sm max-w-full text-ellipsis whitespace-nowrap overflow-hidden">
              <SuggestionContainer path="title" suggestion={suggestion} />
            </div>

            <div className="text-xs max-w-full text-ellipsis whitespace-nowrap overflow-hidden text-muted-foreground">
              <SuggestionContainer path="description" suggestion={suggestion} />
            </div>
          </div>
        </Button>
      ))}

      <div className="mb-2" />
    </>
  );
};

const SearchOptionsModal: React.FC<React.AllHTMLAttributes<HTMLDivElement>> = ({
  ...props
}) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1);

  const [suggestionLength, setSuggestionLength] = useState<number>(1);
  const [topSearchLength, setTopSearchLength] = useState<number>(1);
  const [recentSearchLength, setRecentSearchLength] = useState<number>(1);

  const totalIndexSum = suggestionLength + topSearchLength + recentSearchLength;

  const onKeyDown = () => {
    setSelectedOptionIndex((curr) => (curr + 1) % totalIndexSum);
  };

  const onKeyUp = () => {
    setSelectedOptionIndex(
      (curr) => (curr - 1 + totalIndexSum) % totalIndexSum
    );
  };

  const onEnter = () => {};

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      onKeyDown();
    } else if (e.key === "ArrowUp") {
      onKeyUp();
    } else if (e.key === "Enter") {
      onEnter();
    }
  };

  console.log("selectedOptionIndex: ", selectedOptionIndex);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalIndexSum]);

  return (
    <Card
      {...props}
      className={`${props.className} absolute top-[64px] z-20 rounded-t-none`}
    >
      <CardContent className="p-2 h-[400px] max-h-[75dvh] overflow-y-auto">
        <Suggestions
          selectedOptionIndex={selectedOptionIndex}
          setSuggestionLength={setSuggestionLength}
        />

        <TopSearches
          suggestionLength={suggestionLength}
          selectedOptionIndex={selectedOptionIndex}
          setTopSearchLength={setTopSearchLength}
        />

        <RecentSearches
          suggestionLength={suggestionLength}
          topSearchLength={topSearchLength}
          selectedOptionIndex={selectedOptionIndex}
          setRecentSearchLength={setRecentSearchLength}
        />
      </CardContent>
    </Card>
  );
};

export default SearchOptionsModal;
