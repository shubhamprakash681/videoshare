import React, { forwardRef, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { Card, CardContent } from "@/components/ui/card";
import Suggestions from "./Suggestions";
import TopSearches from "./TopSearches";
import RecentSearches from "./RecentSearches";
import { useSuggestions } from "./hooks/useSuggestions";
import { setVideoStates } from "@/features/videoSlice";
import {
  setRenderLoadingOnSearchOrSort,
  setSearchboxOpen,
} from "@/features/uiSlice";

interface SearchOptionsModalProps
  extends React.AllHTMLAttributes<HTMLDivElement> {}

export const SearchOptionsModal = forwardRef<
  HTMLDivElement,
  SearchOptionsModalProps
>((props, ref) => {
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

  const handleEnter = useCallback(
    (selectedIndex: number) => {
      if (selectedIndex < 0) {
        // search with keyword present in search box
        dispatch(setRenderLoadingOnSearchOrSort(true));
        dispatch(setVideoStates({ query: searchKey.toLowerCase() }));
        dispatch(setSearchboxOpen(false));
        return;
      }

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
        dispatch(setRenderLoadingOnSearchOrSort(true));
        dispatch(setVideoStates({ query: selectedOption.toLowerCase() }));
        dispatch(setSearchboxOpen(false));
      }
    },
    [searchKey, suggestions, topSearches, recentSearches]
  );

  const handleOptionClick = (selectedOption: string) => {
    if (selectedOption) {
      dispatch(setRenderLoadingOnSearchOrSort(true));
      dispatch(setVideoStates({ query: selectedOption.toLowerCase() }));
      dispatch(setSearchboxOpen(false));
    }
  };

  const { selectedIndex } = useKeyboardNavigation(totalItems, handleEnter);

  return (
    <Card
      ref={ref}
      {...props}
      className={`${props.className} absolute top-[64px] z-20 rounded-t-none`}
    >
      <CardContent className="p-2 h-[400px] max-h-[75dvh] overflow-y-auto">
        <Suggestions
          selectedOptionIndex={selectedIndex}
          setSuggestionLength={setSuggestionLength}
          handleOptionClick={handleOptionClick}
        />
        <TopSearches
          suggestionLength={suggestionLength}
          selectedOptionIndex={selectedIndex}
          setTopSearchLength={setTopSearchLength}
          handleOptionClick={handleOptionClick}
        />
        <RecentSearches
          suggestionLength={suggestionLength}
          topSearchLength={topSearchLength}
          selectedOptionIndex={selectedIndex}
          setRecentSearchLength={setRecentSearchLength}
          handleOptionClick={handleOptionClick}
        />
      </CardContent>
    </Card>
  );
});

export default SearchOptionsModal;
