import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setSearchboxOpen } from "@/features/uiSlice";
import { setVideoStates } from "@/features/videoSlice";
import { SearchIcon } from "lucide-react";

interface SearchBoxProps {
  searchOptionsModalRef: React.RefObject<HTMLDivElement>;
}
const SearchBox: React.FC<SearchBoxProps> = ({ searchOptionsModalRef }) => {
  const [searchText, setSearchText] = useState<string>("");

  const dispatch = useAppDispatch();

  const { isSearchboxOpen } = useAppSelector((state) => state.uiReducer);
  const { searchKey, query } = useAppSelector((state) => state.videoReducer);

  const inputBoxRef1 = useRef<HTMLInputElement>(null);
  const inputBoxRef2 = useRef<HTMLInputElement>(null);

  const [isSmallerScreen, setIsSmallerScreen] = useState<boolean>(true);

  const onSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const onSearchClick = () => {
    dispatch(setVideoStates({ query: searchKey.toLowerCase() }));
    setSearchText("");
  };

  const resizeHandler = () => {
    if (window.innerWidth < 640) {
      setIsSmallerScreen(true);
    } else {
      setIsSmallerScreen(false);
    }
  };

  const handleInputBoxClick = (e: MouseEvent) => {
    if (inputBoxRef2.current && isSmallerScreen) {
      if (inputBoxRef2.current.contains(e.target as Node)) {
        dispatch(setSearchboxOpen(true));
      } else {
        if (
          !searchOptionsModalRef.current ||
          (searchOptionsModalRef.current &&
            !searchOptionsModalRef.current.contains(e.target as Node))
        ) {
          dispatch(setSearchboxOpen(false));
        }
      }

      return;
    }

    if (inputBoxRef1.current) {
      if (inputBoxRef1.current.contains(e.target as Node)) {
        dispatch(setSearchboxOpen(true));
      } else {
        if (
          !searchOptionsModalRef.current ||
          (searchOptionsModalRef.current &&
            !searchOptionsModalRef.current.contains(e.target as Node))
        ) {
          dispatch(setSearchboxOpen(false));
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleInputBoxClick);

    return () => {
      document.removeEventListener("mousedown", handleInputBoxClick);
    };
  }, [isSmallerScreen]);

  useEffect(() => {
    resizeHandler();

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

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
    if (searchText !== query) {
      setSearchText(query);
    }
  }, [query]);

  return (
    <div
      id="search-box-container"
      className="flex items-center justify-self-end sm:w-3/5 sm:justify-self-center"
    >
      <div className="hidden sm:flex w-full relative">
        {isSearchboxOpen && (
          <div className="flex items-center absolute left-2 h-full">
            <SearchIcon height={18} width={18} />
          </div>
        )}
        <Input
          title="Search Box"
          placeholder="Search"
          ref={inputBoxRef1}
          value={searchText}
          onChange={onSearchQueryChange}
          className={`w-full rounded-r-none rounded-l-full outline-none ${
            isSearchboxOpen && "pl-8"
          }`}
        />

        <Button
          title="Search"
          variant={"secondary"}
          type="submit"
          className="rounded-l-none rounded-r-full"
          onClick={onSearchClick}
        >
          <SearchIcon height={20} width={20} />
        </Button>
      </div>

      <div className="sm:hidden">
        {isSearchboxOpen ? (
          <div className="flex w-full relative">
            <Input
              title="Search Box"
              placeholder="Search"
              ref={inputBoxRef2}
              value={searchText}
              onChange={onSearchQueryChange}
              className="w-full rounded-r-none rounded-l-full outline-none"
            />

            <Button
              title="Search small"
              variant={"secondary"}
              type="submit"
              className="rounded-l-none rounded-r-full"
              onClick={onSearchClick}
            >
              <SearchIcon height={20} width={20} />
            </Button>
          </div>
        ) : (
          <Button
            title="Search Video"
            variant={"ghost"}
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
