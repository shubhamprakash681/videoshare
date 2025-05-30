import { useLocation } from "react-router-dom";

const getRouteSpecificMinWidth = (route: string): string => {
  switch (route) {
    case "/":
      return "272px";
    case "/video":
      return "460px";
    case "/edit-playlist":
      return "460px";
    case "/playlist":
      return "460px";
    case "/like-playlist":
      return "460px";
    case "/watch-playlist":
      return "460px";
    case "/dashboard":
      return "360px";
    default:
      return "272px";
  }
};

const useResponsiveBottomContainer = () => {
  const location = useLocation();

  const route = `/${location.pathname.split("/")[1]}`;

  const bottomContainerMinWidth = getRouteSpecificMinWidth(route);

  return { bottomContainerMinWidth };
};

export default useResponsiveBottomContainer;
