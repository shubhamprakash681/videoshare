import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "./hooks/useStore";
import { Footer, Header, SidebarContainer } from "./components";

const SIDEBAR_WIDTH = "250px";

const App: React.FC = () => {
  const { theme } = useAppSelector((state) => state.themeReducer);
  const { isSidebarOpen } = useAppSelector((state) => state.uiReducer);

  const [SIDEBAR_WIDTH_CLOSED, setSIDEBAR_WIDTH_CLOSED] =
    useState<string>("100px");
  const [isSmallerScreen, setIsSmallerScreen] = useState<boolean>(true);

  useEffect(() => {
    const html = document.querySelector("html");

    html?.classList.remove("light", "dark");
    html?.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth < 640) {
        setIsSmallerScreen(true);
        setSIDEBAR_WIDTH_CLOSED("0px");
      } else {
        setIsSmallerScreen(false);
        setSIDEBAR_WIDTH_CLOSED("100px");
      }
    };

    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="app-container bg-background text-foreground">
      <div className="outer-top shadow-md backdrop-blur supports-[backdrop-filter]:bg-background">
        <Header />
      </div>

      <div className="outer-bottom">
        <div className="relative flex flex-col items-end">
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
              border: "1px solid green",
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
  );
};

export default App;
