import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { toggleTheme } from "@/features/themeSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { toggleSidebarOpen } from "@/features/uiSlice";
import SearchBox from "./SearchBox";
import { MenuIcon, MoonIcon, SunIcon, Video } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

interface ThemeToggleButtonProps
  extends React.AllHTMLAttributes<HTMLButtonElement> {
  theme: "light" | "dark";
  dispatch: any;

  className?: string;
}
const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  theme,
  dispatch,
  className,
}) => {
  if (theme === "light") {
    return (
      <Button
        title="Swich to Dark Mode"
        className={className}
        variant="outline"
        onClick={() => dispatch(toggleTheme())}
      >
        <SunIcon height={"20px"} width={"20px"} />
      </Button>
    );
  }

  return (
    <Button
      title="Swich to Light Mode"
      className={className}
      variant="outline"
      onClick={() => dispatch(toggleTheme())}
    >
      <MoonIcon height={"20px"} width={"20px"} />
    </Button>
  );
};

type SidebarToggleButtonProps = {
  dispatch: any;
};
const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({
  dispatch,
}) => {
  return (
    <Button
      title="Sidebar"
      variant="ghost"
      style={{ borderRadius: "50%", padding: "10px" }}
      onClick={() => dispatch(toggleSidebarOpen())}
    >
      <MenuIcon height={"20px"} width={"20px"} />
    </Button>
  );
};

interface HeaderProps {
  searchOptionsModalRef: React.RefObject<HTMLDivElement>;
  isSmallerScreen: boolean;
}
const Header: React.FC<HeaderProps> = ({
  searchOptionsModalRef,
  isSmallerScreen,
}) => {
  const { theme } = useAppSelector((state) => state.themeReducer);
  const { isAuthenticated, userData } = useAppSelector(
    (state) => state.authReducer
  );

  const dispatch = useAppDispatch();

  return (
    <header
      className="p-3 grid items-center border-b"
      style={{ gridTemplateColumns: "auto 1fr" }}
    >
      <div className="sm:space-x-2 flex items-center">
        {isAuthenticated && (
          <SidebarToggleButton dispatch={dispatch} key={"sidebar-toggle-btn"} />
        )}

        <Link to={"/"} className="flex items-center gap-1">
          <Video className="h-6 w-6 text-primary" />
          {!isSmallerScreen && (
            <span className="text-xl font-bold w-fit prevent-select">
              VideoShare
            </span>
          )}
        </Link>
      </div>

      <div
        className="w-full grid items-center space-x-1 sm:space-x-3"
        style={{ gridTemplateColumns: "1fr auto" }}
      >
        <SearchBox searchOptionsModalRef={searchOptionsModalRef} />

        <div className="justify-self-end flex items-center space-x-1 sm:space-x-2">
          <ThemeToggleButton
            key={"theme-toggle-md"}
            theme={theme}
            dispatch={dispatch}
            className="p-3 w-10 h-10 rounded-full"
          />
          {isAuthenticated ? (
            <ProfileDropdown avatarUrl={userData?.avatar.url || ""} />
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
