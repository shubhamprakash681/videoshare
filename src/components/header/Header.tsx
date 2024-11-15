import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { MoonIcon, SunIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { toggleTheme } from "@/features/themeSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { toggleSidebarOpen } from "@/features/uiSlice";
import SearchBox from "./SearchBox";

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
      <HamburgerMenuIcon height={"20px"} width={"20px"} />
    </Button>
  );
};

const Header = () => {
  const { theme } = useAppSelector((state) => state.themeReducer);
  const dispatch = useAppDispatch();

  return (
    <header
      className="p-3 grid items-center"
      style={{ gridTemplateColumns: "auto 1fr" }}
    >
      <div className="sm:space-x-2 flex items-center">
        <SidebarToggleButton dispatch={dispatch} key={"sidebar-toggle-btn"} />
        <Link to={"/"}>
          <span className="text-xl font-bold" style={{ width: "70px" }}>
            VideoShare
          </span>
        </Link>
      </div>

      <div
        className="w-full grid items-center space-x-3"
        style={{ gridTemplateColumns: "1fr auto" }}
      >
        <SearchBox />

        <ThemeToggleButton
          className="justify-self-end"
          key={"theme-toggle-md"}
          theme={theme}
          dispatch={dispatch}
        />
      </div>

      {/* {isAuthenticated && (
            <li>
              <LogoutButton />
            </li>
          )} */}
    </header>
  );
};

export default Header;
