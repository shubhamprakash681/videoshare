import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setSearchboxOpen } from "@/features/uiSlice";
import { setVideoStates } from "@/features/videoSlice";
import { SearchIcon } from "lucide-react";
import { formatSearchText } from "@/lib/video";

interface SearchBoxProps {
  searchOptionsModalRef: React.RefObject<HTMLDivElement>;
}
const SearchBox: React.FC<SearchBoxProps> = ({ searchOptionsModalRef }) => {
  const { isSearchboxOpen } = useAppSelector((state) => state.uiReducer);
  const { searchKey, query } = useAppSelector((state) => state.videoReducer);

  const [searchText, setSearchText] = useState<string>(searchKey);

  const searchFormRef = useRef<HTMLFormElement>(null);

  const dispatch = useAppDispatch();

  const onSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const onSearchSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (searchText.trim() === "") {
      return;
    }
    dispatch(setVideoStates({ query: searchText.toLowerCase() }));
    dispatch(setSearchboxOpen(false));
  };

  const handleMousedown = useCallback(
    (e: MouseEvent) => {
      if (searchFormRef.current && searchOptionsModalRef.current) {
        if (
          !searchFormRef.current.contains(e.target as Node) &&
          !searchOptionsModalRef.current.contains(e.target as Node)
        ) {
          if (isSearchboxOpen) {
            setSearchText(formatSearchText(query));
            dispatch(setSearchboxOpen(false));
          }
        }
      }
    },
    [searchFormRef, searchOptionsModalRef, isSearchboxOpen, query]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleMousedown);

    return () => {
      document.removeEventListener("mousedown", handleMousedown);
    };
  }, [searchFormRef, searchOptionsModalRef, isSearchboxOpen, query]);

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
        ref={searchFormRef}
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
          className={`w-full rounded-r-none rounded-l-full outline-none ${
            isSearchboxOpen && "pl-8"
          }`}
        />

        <Button
          title="Search"
          variant="secondary"
          type="submit"
          className="rounded-l-none rounded-r-full"
          onClick={() => dispatch(setSearchboxOpen(false))}
        >
          <SearchIcon height={20} width={20} />
        </Button>
      </form>

      <div className="sm:hidden">
        {isSearchboxOpen ? (
          <form
            className="flex w-full relative"
            onSubmit={onSearchSubmit}
            ref={searchFormRef}
          >
            <Input
              title="Search Box"
              placeholder="Search"
              value={searchText}
              onChange={onSearchQueryChange}
              className="w-full rounded-r-none rounded-l-full outline-none"
            />

            <Button
              title="Search"
              variant="secondary"
              type="submit"
              className="rounded-l-none rounded-r-full"
              onClick={() =>
                !isSearchboxOpen && dispatch(setSearchboxOpen(true))
              }
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
