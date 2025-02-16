import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/useStore";
import {
  Footer,
  Header,
  SearchOptionsModal,
  SidebarContainer,
} from "./components";
import { IUser } from "./types/collections";
import { APIResponse, TopSearchOption } from "./types/APIResponse";
import { login } from "./features/authSlice";
import { useToast } from "./hooks/use-toast";
import { AxiosAPIInstance, AxiosInterceptor } from "./lib/AxiosInstance";
import useResponsiveBottomContainer from "./hooks/useResponsiveBottomContainer";
import { setTopSearches } from "./features/videoSlice";
import { setPreventCustomKeyPress } from "./features/uiSlice";

type RefreshSessionResponseData = {
  accessToken: string;
  refreshToken: string;
  user: IUser;
};

const SIDEBAR_WIDTH = "250px";

const App: React.FC = () => {
  const { theme } = useAppSelector((state) => state.themeReducer);
  const { query, topSearches } = useAppSelector((state) => state.videoReducer);
  const { isSidebarOpen, isSearchboxOpen } = useAppSelector(
    (state) => state.uiReducer
  );
  const { isAuthenticated } = useAppSelector((state) => state.authReducer);
  const { bottomContainerMinWidth } = useResponsiveBottomContainer();
  const searchOptionsModalRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [SIDEBAR_WIDTH_CLOSED, setSIDEBAR_WIDTH_CLOSED] =
    useState<string>("0px");
  const [searchOptionModalWidth, setSearchOptionModalWidth] =
    useState<string>("100%");
  const [searchOptionModalLeftPos, setSearchOptionModalLeftPos] =
    useState<string>("0");
  const [isSmallerScreen, setIsSmallerScreen] = useState<boolean>(true);

  const resizeHandler = () => {
    if (window.innerWidth < 640) {
      setIsSmallerScreen(true);
      setSIDEBAR_WIDTH_CLOSED("0px");

      setSearchOptionModalWidth("100%");
      setSearchOptionModalLeftPos("0");
    } else {
      setIsSmallerScreen(false);
      setSIDEBAR_WIDTH_CLOSED("100px");

      const searchBox = document.getElementById("search-box-container");
      setSearchOptionModalWidth(`${searchBox?.offsetWidth}px` || "100%");
      setSearchOptionModalLeftPos(
        `${searchBox?.getBoundingClientRect().left}px` || "0"
      );
    }
  };
  const refreshSessionOnLoad = async () => {
    const res = await AxiosAPIInstance.post<
      APIResponse<RefreshSessionResponseData>
    >("/api/v1/user/refresh-session");

    if (res.data.success) {
      dispatch(login(res.data.data?.user));
      toast({
        title: res.data.message,
      });
    }
  };

  const fetchTopSearches = async () => {
    try {
      const { data } = await AxiosAPIInstance.get<
        APIResponse<TopSearchOption[]>
      >("/api/v1/search?limit=10");

      if (data.success && data.data) dispatch(setTopSearches(data.data));
    } catch (error) {
      setTopSearches([]);
      console.error(error);
    }
  };

  useEffect(() => {
    const html = document.querySelector("html");

    html?.classList.remove("light", "dark");
    html?.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (query) {
      navigate("/");

      let recentSearches: string[] = JSON.parse(
        localStorage.getItem("videoshare-recent-searches") || "[]"
      );

      recentSearches = [query, ...recentSearches];
      const newRecentSearch = Array.from(new Set(recentSearches)).slice(0, 20);
      localStorage.setItem(
        "videoshare-recent-searches",
        JSON.stringify(newRecentSearch)
      );

      const isPresentInTopSearches = topSearches.findIndex(
        (searchOption) =>
          searchOption.searchText.toLowerCase() === query.trim().toLowerCase()
      );
      if (isPresentInTopSearches > -1) {
        const topSearchCopy = JSON.parse(JSON.stringify(topSearches));
        topSearchCopy[isPresentInTopSearches].count += 1;
        dispatch(setTopSearches(topSearchCopy));
      }
    }
  }, [query]);

  useEffect(() => {
    resizeHandler();
    refreshSessionOnLoad();
    fetchTopSearches();

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    resizeHandler();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isSearchboxOpen) {
      dispatch(setPreventCustomKeyPress(true));
    } else {
      dispatch(setPreventCustomKeyPress(false));
    }
  }, [isSearchboxOpen]);

  if (!isAuthenticated) {
    return (
      <AxiosInterceptor>
        <div className="app-container bg-background text-foreground">
          <div className="outer-top shadow-md backdrop-blur supports-[backdrop-filter]:bg-background">
            <Header searchOptionsModalRef={searchOptionsModalRef} />
          </div>

          {isSearchboxOpen && (
            <SearchOptionsModal
              ref={searchOptionsModalRef}
              style={{
                left: searchOptionModalLeftPos,
                width: searchOptionModalWidth,
              }}
            />
          )}

          <div className="outer-bottom">
            <div style={{ minWidth: bottomContainerMinWidth }}>
              <Outlet />

              <Footer
                isSmallerScreen={isSmallerScreen}
                isSidebarOpen={isSidebarOpen}
                SIDEBAR_WIDTH={SIDEBAR_WIDTH}
                SIDEBAR_WIDTH_CLOSED={SIDEBAR_WIDTH_CLOSED}
              />
            </div>
          </div>
        </div>
      </AxiosInterceptor>
    );
  }

  return (
    <AxiosInterceptor>
      <div className="app-container bg-background text-foreground">
        <div className="outer-top shadow-md backdrop-blur supports-[backdrop-filter]:bg-background">
          <Header searchOptionsModalRef={searchOptionsModalRef} />
        </div>

        {isSearchboxOpen && (
          <SearchOptionsModal
            ref={searchOptionsModalRef}
            style={{
              left: searchOptionModalLeftPos,
              width: searchOptionModalWidth,
            }}
          />
        )}

        <div className="outer-bottom">
          <div
            className="relative flex flex-col items-end"
            style={{ minWidth: bottomContainerMinWidth }}
          >
            <SidebarContainer
              isOpen={isSidebarOpen}
              SIDEBAR_WIDTH={SIDEBAR_WIDTH}
              SIDEBAR_WIDTH_CLOSED={SIDEBAR_WIDTH_CLOSED}
            />

            <div
              style={{
                width: isSmallerScreen
                  ? "100%"
                  : isSidebarOpen
                  ? `calc(100% - ${SIDEBAR_WIDTH})`
                  : `calc(100% - ${SIDEBAR_WIDTH_CLOSED})`,
                // border: "1px solid green",
              }}
            >
              <Outlet />
            </div>

            <Footer
              isSmallerScreen={isSmallerScreen}
              isSidebarOpen={isSidebarOpen}
              SIDEBAR_WIDTH={SIDEBAR_WIDTH}
              SIDEBAR_WIDTH_CLOSED={SIDEBAR_WIDTH_CLOSED}
            />
          </div>
        </div>
      </div>
    </AxiosInterceptor>
  );
};

export default App;
