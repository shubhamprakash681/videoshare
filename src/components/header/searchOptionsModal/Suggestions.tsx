import React, { useEffect } from "react";
import { useAppSelector } from "@/hooks/useStore";
import { ListVideo } from "lucide-react";
import HighlightedSearch from "./HighlightedSearch";
import { Button } from "@/components/ui/button";
import { useSuggestions } from "./hooks/useSuggestions";
import { SearchSuggestions } from "@/types/APIResponse";

interface SuggestionsProps {
  selectedOptionIndex: number;
  setSuggestionLength: React.Dispatch<React.SetStateAction<number>>;
  handleOptionClick: (selectedOption: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({
  selectedOptionIndex,
  setSuggestionLength,
  handleOptionClick,
}) => {
  const { searchKey } = useAppSelector((state) => state.videoReducer);
  const { suggestions, isLoading } = useSuggestions(searchKey);

  useEffect(() => {
    setSuggestionLength(suggestions.length);
  }, [suggestions.length]);

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
          className={`py-1 px-1 sm:px-2 rounded-md w-full min-h-fit flex items-center justify-start gap-1 my-1 ${
            index === selectedOptionIndex && "bg-secondary"
          }`}
          variant={"outline"}
          disabled={isLoading}
          onClick={() => handleOptionClick(suggestion.title)}
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

export default Suggestions;
