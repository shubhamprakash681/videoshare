import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/useStore";
import { Footer, Header, SidebarContainer } from "./components";
import { IUser } from "./types/collections";
import { APIResponse } from "./types/APIResponse";
import { login } from "./features/authSlice";
import { useToast } from "./hooks/use-toast";
import { AxiosAPIInstance, AxiosInterceptor } from "./lib/AxiosInstance";
import useResponsiveBottomContainer from "./hooks/useResponsiveBottomContainer";

type RefreshSessionResponseData = {
  accessToken: string;
  refreshToken: string;
  user: IUser;
};

const SIDEBAR_WIDTH = "250px";

const App: React.FC = () => {
  const { theme } = useAppSelector((state) => state.themeReducer);
  const { isSidebarOpen } = useAppSelector((state) => state.uiReducer);
  const { isAuthenticated } = useAppSelector((state) => state.authReducer);
  const { bottomContainerMinWidth } = useResponsiveBottomContainer();

  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [SIDEBAR_WIDTH_CLOSED, setSIDEBAR_WIDTH_CLOSED] =
    useState<string>("100px");
  const [isSmallerScreen, setIsSmallerScreen] = useState<boolean>(true);

  const resizeHandler = () => {
    if (window.innerWidth < 640) {
      setIsSmallerScreen(true);
      setSIDEBAR_WIDTH_CLOSED("0px");
    } else {
      setIsSmallerScreen(false);
      setSIDEBAR_WIDTH_CLOSED("100px");
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

  useEffect(() => {
    const html = document.querySelector("html");

    html?.classList.remove("light", "dark");
    html?.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    resizeHandler();
    refreshSessionOnLoad();

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <AxiosInterceptor>
        <div className="app-container bg-background text-foreground">
          <div className="outer-top shadow-md backdrop-blur supports-[backdrop-filter]:bg-background">
            <Header />
          </div>

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
          <Header />
        </div>

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
