import React, { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setSearchboxOpen } from "@/features/uiSlice";
import { setVideoStates } from "@/features/videoSlice";
import { SearchIcon } from "lucide-react";

const SearchBox = () => {
  const dispatch = useAppDispatch();

  const { isSearchboxOpen } = useAppSelector((state) => state.uiReducer);
  const { query } = useAppSelector((state) => state.videoReducer);

  const inputBoxRef = useRef<HTMLInputElement>(null);

  const videoSearchHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("searching");
  };

  const onSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setVideoStates({ query: e.target.value }));
  };

  useEffect(() => {
    const handleInputBoxClick = (e: MouseEvent) => {
      if (inputBoxRef.current) {
        if (inputBoxRef.current.contains(e.target as Node)) {
          dispatch(setSearchboxOpen(true));
        } else {
          dispatch(setSearchboxOpen(false));
        }
      }
    };

    document.addEventListener("mousedown", handleInputBoxClick);

    return () => {
      document.removeEventListener("mousedown", handleInputBoxClick);
    };
  }, []);

  return (
    <div className="flex items-center justify-self-end sm:w-3/5 sm:justify-self-center">
      <form
        onSubmit={videoSearchHandler}
        className="hidden sm:flex w-full relative"
      >
        {isSearchboxOpen && (
          <div className="flex items-center absolute left-2 h-full">
            <SearchIcon height={18} width={18} />
          </div>
        )}
        <Input
          title="Search Box"
          placeholder="Search"
          ref={inputBoxRef}
          value={query}
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
        >
          <SearchIcon height={20} width={20} />
        </Button>
      </form>

      <div className="sm:hidden">
        {isSearchboxOpen ? (
          <form onSubmit={videoSearchHandler} className="flex w-full relative">
            {isSearchboxOpen && (
              <div className="flex items-center absolute left-2 h-full">
                <SearchIcon height={18} width={18} />
              </div>
            )}
            <Input
              title="Search Box"
              placeholder="Search"
              ref={inputBoxRef}
              value={query}
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
            >
              <SearchIcon height={20} width={20} />
            </Button>
          </form>
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
