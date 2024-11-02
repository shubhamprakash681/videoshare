import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { MoonIcon, SunIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { toggleTheme } from "@/features/themeSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { toggleSidebarOpen } from "@/features/uiSlice";

type ThemeToggleButtonProps = {
  theme: "light" | "dark";
  dispatch: any;
};
const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  theme,
  dispatch,
}) => {
  if (theme === "light") {
    return (
      <Button variant="outline" onClick={() => dispatch(toggleTheme())}>
        <SunIcon height={"20px"} width={"20px"} />
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={() => dispatch(toggleTheme())}>
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
    <header className="p-3">
      <div className="flex items-center justify-between">
        <div className="sm:space-x-2 flex items-center">
          <SidebarToggleButton dispatch={dispatch} key={"sidebar-toggle-btn"} />

          <Link to={"/"}>
            <span className="text-xl font-bold" style={{ width: "70px" }}>
              VideoShare
            </span>
          </Link>
        </div>

        <ThemeToggleButton
          key={"theme-toggle-md"}
          theme={theme}
          dispatch={dispatch}
        />

        {/* {isAuthenticated && (
            <li>
              <LogoutButton />
            </li>
          )} */}
      </div>
    </header>
  );
};

export default Header;
