import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { SearchIcon, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { setVideoStates } from "@/features/videoSlice";
import {
  setRenderLoadingOnSearchOrSort,
  setSearchboxOpen,
} from "@/features/uiSlice";
import { formatSearchText } from "@/lib/video";

const SearchBox: React.FC = () => {
  const { isSearchboxOpen } = useAppSelector((state) => state.uiReducer);
  const { searchKey, query } = useAppSelector((state) => state.videoReducer);

  const [searchText, setSearchText] = useState<string>(searchKey);

  const dispatch = useAppDispatch();

  const onSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const onSearchSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (searchText.trim() === "") {
      return;
    }
    dispatch(setRenderLoadingOnSearchOrSort(true));
    dispatch(setVideoStates({ query: searchText.toLowerCase() }));
    dispatch(setSearchboxOpen(false));
  };

  const onSearchReset = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    event.preventDefault();

    dispatch(setRenderLoadingOnSearchOrSort(true));
    setSearchText("");
    dispatch(setVideoStates({ searchKey: "", query: "" }));
  };

  const onSearchFocusOut = () => {
    const timer = setTimeout(() => {
      dispatch(setSearchboxOpen(false));
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  };

  // debouncing searchText
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setVideoStates({ searchKey: searchText }));
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  useEffect(() => {
    if (searchText.toLowerCase() !== query.toLowerCase()) {
      setSearchText(formatSearchText(query));
    }
  }, [query]);

  return (
    <div
      id="search-box-container"
      className="flex items-center justify-self-end sm:w-3/5 sm:justify-self-center"
    >
      <form
        className="hidden sm:flex w-full relative"
        onSubmit={onSearchSubmit}
        onBlur={onSearchFocusOut}
      >
        {isSearchboxOpen && (
          <div className="flex items-center absolute left-2 h-full">
            <SearchIcon height={18} width={18} />
          </div>
        )}
        <Input
          title="Search Box"
          placeholder="Search"
          value={searchText}
          onClick={() => !isSearchboxOpen && dispatch(setSearchboxOpen(true))}
          onChange={onSearchQueryChange}
          className={`w-full rounded-r-none rounded-l-full outline-none pr-11 ${
            isSearchboxOpen && "pl-8"
          }`}
        />

        {isSearchboxOpen && (
          <Button
            title="Clear Search"
            variant="ghost"
            type="button"
            onClick={onSearchReset}
            className="-ml-10 px-3 rounded-full"
          >
            <X height={10} width={10} />
          </Button>
        )}

        <Button
          title="Search"
          variant="secondary"
          type="submit"
          className="rounded-l-none rounded-r-full"
        >
          <SearchIcon height={20} width={20} />
        </Button>
      </form>

      <div className="sm:hidden">
        {isSearchboxOpen ? (
          <form
            className="flex w-full relative"
            onSubmit={onSearchSubmit}
            onBlur={onSearchFocusOut}
          >
            <Input
              title="Search Box"
              placeholder="Search"
              value={searchText}
              onChange={onSearchQueryChange}
              className="w-full rounded-r-none rounded-l-full outline-none"
            />

            {isSearchboxOpen && (
              <Button
                title="Clear Search"
                variant="ghost"
                type="button"
                onClick={onSearchReset}
                className="-ml-10 px-3 rounded-full"
              >
                <X height={10} width={10} />
              </Button>
            )}

            <Button
              title="Search"
              variant="secondary"
              type="submit"
              className="rounded-l-none rounded-r-full"
            >
              <SearchIcon height={20} width={20} />
            </Button>
          </form>
        ) : (
          <Button
            title="Search Video"
            variant="ghost"
            type="button"
            className="rounded-full p-[9px] flex items-center justify-center"
            onClick={() => !isSearchboxOpen && dispatch(setSearchboxOpen(true))}
          >
            <SearchIcon height={20} width={20} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
