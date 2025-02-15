import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { Card, CardContent } from "@/components/ui/card";
import Suggestions from "./Suggestions";
import TopSearches from "./TopSearches";
import RecentSearches from "./RecentSearches";
import { useSuggestions } from "./hooks/useSuggestions";
import { setVideoStates } from "@/features/videoSlice";
import { setSearchboxOpen } from "@/features/uiSlice";

export const SearchOptionsModal: React.FC<
  React.AllHTMLAttributes<HTMLDivElement>
> = ({ ...props }) => {
  const [suggestionLength, setSuggestionLength] = useState<number>(0);
  const [topSearchLength, setTopSearchLength] = useState<number>(0);
  const [recentSearchLength, setRecentSearchLength] = useState<number>(0);

  const { topSearches } = useAppSelector((state) => state.videoReducer);
  const recentSearches = JSON.parse(
    localStorage.getItem("videoshare-recent-searches") || "[]"
  );
  const { searchKey } = useAppSelector((state) => state.videoReducer);
  const { suggestions } = useSuggestions(searchKey);

  const dispatch = useAppDispatch();

  const totalItems = suggestionLength + topSearchLength + recentSearchLength;

  const handleEnter = (selectedIndex: number) => {
    if (selectedIndex < 0) return;

    let selectedOption: string | undefined;

    if (selectedIndex < suggestionLength) {
      const suggestion = suggestions[selectedIndex];
      selectedOption = suggestion.title;
    } else if (selectedIndex < suggestionLength + topSearchLength) {
      const topSearch = topSearches[selectedIndex - suggestionLength];
      selectedOption = topSearch.searchText;
    } else {
      const recentSearch =
        recentSearches[selectedIndex - suggestionLength - topSearchLength];
      selectedOption = recentSearch;
    }

    if (selectedOption) {
      dispatch(setVideoStates({ query: selectedOption }));
      dispatch(setSearchboxOpen(false));
    }
  };

  const { selectedIndex } = useKeyboardNavigation(totalItems, handleEnter);

  return (
    <Card
      {...props}
      className={`${props.className} absolute top-[64px] z-20 rounded-t-none`}
    >
      <CardContent className="p-2 h-[400px] max-h-[75dvh] overflow-y-auto">
        <Suggestions
          selectedOptionIndex={selectedIndex}
          setSuggestionLength={setSuggestionLength}
        />
        <TopSearches
          suggestionLength={suggestionLength}
          selectedOptionIndex={selectedIndex}
          setTopSearchLength={setTopSearchLength}
        />
        <RecentSearches
          suggestionLength={suggestionLength}
          topSearchLength={topSearchLength}
          selectedOptionIndex={selectedIndex}
          setRecentSearchLength={setRecentSearchLength}
        />
      </CardContent>
    </Card>
  );
};

export default SearchOptionsModal;
