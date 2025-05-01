import React, { useEffect, useState } from "react";
import {
  Home,
  Video,
  ThumbsUp,
  ChevronsUp,
  ChevronsDown,
  ListVideo,
  Users,
  MessageCircle,
  LayoutDashboard,
  ArrowRight,
  PanelLeftOpen,
  PanelLeftClose,
  History,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { AggregatedResponse, APIResponse } from "@/types/APIResponse";
import { Subscription } from "@/types/collections";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import Loader from "../ui/Loader";
import { Separator } from "../ui/separator";
import { setSidebarOpen } from "@/features/uiSlice";
import { PathConstants } from "@/lib/variables";

type MenuItem = {
  title: string;
  isExpanded: boolean;
  items: {
    name: string;
    url: string;
    icon: React.ReactNode | string;
  }[];
};

interface SidebarProps extends React.AllHTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  SIDEBAR_WIDTH: string;
  SIDEBAR_WIDTH_CLOSED: string;

  className?: string;
}

const SidebarContainer: React.FC<SidebarProps> = ({
  isOpen = false,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_CLOSED,

  className,
  ...props
}) => {
  const { userData, isAuthenticated } = useAppSelector(
    (state) => state.authReducer
  );

  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItem);

  const [isSubscriptionsLoading, setIsSubscriptionsLoading] =
    useState<boolean>(false);

  const toggleMenuOpen = (index: number) => {
    setMenuItems((prevMenuItems) =>
      prevMenuItems.map((item, i) =>
        i === index ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const fetchSubscriptions = async () => {
    setIsSubscriptionsLoading(true);
    try {
      const { data } = await AxiosAPIInstance.get<
        APIResponse<AggregatedResponse<Subscription>>
      >(`/api/v1/subscription/user/${userData?._id}`);

      if (data.success && data.data) {
        const subscriptionMenuData: MenuItem["items"] = data.data?.docs.map(
          (subDoc) => {
            return {
              name: subDoc.channel.fullname,
              icon: subDoc.channel.avatar.url,
              url: `/${subDoc.channel.username}`,
            };
          }
        );

        setMenuItems((prevMenuItems) =>
          prevMenuItems.map((item) =>
            item.title === "Subscriptions"
              ? { ...item, items: subscriptionMenuData }
              : item
          )
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Failed to load subscriptions",
          variant: "destructive",
        });
      }

      setMenuItems((prevMenuItems) =>
        prevMenuItems.map((item) =>
          item.title === "Subscriptions" ? { ...item, items: [] } : item
        )
      );

      console.error(error);
    } finally {
      setIsSubscriptionsLoading(false);
    }
  };

  useEffect(() => {
    isAuthenticated && fetchSubscriptions();
  }, [isAuthenticated]);

  if (!isOpen) {
    return (
      <div
        className="hidden sm:flex absolute left-0 top-0 h-full bg-sidebar text-sidebar-foreground z-10"
        style={{ width: SIDEBAR_WIDTH_CLOSED }}
      >
        <div
          {...props}
          className={`${className} custom-sidebar`}
          style={{ width: SIDEBAR_WIDTH_CLOSED }}
        >
          <div className="w-full h-full px-1 py-2 overflow-y-auto">
            {menuItems
              .filter((menuItem) => menuItem.title !== "Subscriptions")
              .map((menuItem, menuItemIndex) => (
                <div
                  key={`sm-${menuItem.title}-${menuItemIndex}`}
                  className="flex flex-col items-center"
                >
                  <span className="font-semibold">{menuItem.title}</span>

                  {menuItem.items.map((item, index) => (
                    <Button
                      variant={"ghost"}
                      key={`sm-subitem-${item.name}-${index}`}
                      onClick={() => navigate(item.url)}
                      title={item.name}
                      className="my-1 scale-[110%] flex items-center justify-start space-x-2 transition duration-150 ease-linear hover:scale-[120%]"
                    >
                      {item.icon}
                    </Button>
                  ))}

                  {menuItemIndex !== 2 && <Separator className="my-2" />}
                </div>
              ))}
          </div>

          <div className="p-2">
            <Button
              onClick={() => dispatch(setSidebarOpen(true))}
              variant="outline"
              className="w-full p-2"
            >
              Expand
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full absolute left-0 top-0 bg-sidebar text-sidebar-foreground z-10"
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div
        {...props}
        className={`${className} custom-sidebar`}
        style={{ width: SIDEBAR_WIDTH }}
      >
        <div className="w-full h-full p-2 overflow-y-auto">
          {menuItems.map((menuItem, menuItemIndex) => (
            <Collapsible
              key={`${menuItem.title}-${menuItemIndex}`}
              open={menuItem.isExpanded}
              onOpenChange={() => toggleMenuOpen(menuItemIndex)}
              className="w-full space-y-2"
            >
              <CollapsibleTrigger asChild>
                <Button
                  className="min-h-fit w-full flex items-center justify-between"
                  variant="ghost"
                  size="sm"
                >
                  <h4 className="text-sm font-semibold">{menuItem.title}</h4>
                  {menuItem.isExpanded ? (
                    <ChevronsUp className="h-4 w-4" />
                  ) : (
                    <ChevronsDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="transition duration-150 ease-linear">
                {menuItem.title === "Subscriptions" &&
                isSubscriptionsLoading ? (
                  <div className="my-10">
                    <Loader />
                  </div>
                ) : (
                  menuItem.items.map((item, index) => (
                    <Button
                      variant={"ghost"}
                      key={`subitem-${item.name}-${index}`}
                      onClick={() => navigate(item.url)}
                      className="min-h-fit w-full flex items-center justify-start space-x-2 transition duration-150 ease-linear hover:scale-[101%]"
                    >
                      {menuItem.title === "Subscriptions" ? (
                        <Avatar>
                          <AvatarImage src={item.url} alt="CN" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      ) : (
                        item.icon
                      )}
                      {item.name}
                    </Button>
                  ))
                )}

                {menuItem.title === "Subscriptions" && true && (
                  <Button
                    onClick={() => navigate("/me?tab=subscribed")}
                    variant="link"
                    className="flex items-center space-x-2 transition duration-150 ease-linear hover:scale-[101%] group"
                  >
                    More
                    <ArrowRight className="h-4 w-4 transition duration-150 ease-linear group-hover:translate-x-1" />
                  </Button>
                )}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        <div className="p-2">
          <Button
            onClick={() => dispatch(setSidebarOpen(false))}
            variant="outline"
            className="w-full p-2"
          >
            Collapse Sidebar
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarContainer;

const defaultMenuItem: MenuItem[] = [
  {
    title: "Home",
    isExpanded: true,
    items: [
      {
        name: "Home",
        url: PathConstants.HOME,
        icon: <Home className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Channel",
    isExpanded: true,
    items: [
      {
        name: "My Channel",
        icon: <Video className="h-4 w-4" />,
        url: "/me?tab=videos",
      },
      {
        name: "Dashboard",
        url: PathConstants.DASHBOARD,
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "You",
    isExpanded: true,
    items: [
      {
        name: "Liked Videos",
        url: PathConstants.LIKEDVIDEOS,
        icon: <ThumbsUp className="h-4 w-4" />,
      },
      {
        name: "Videos",
        url: "/me?tab=videos",
        icon: <Video className="h-4 w-4" />,
      },
      {
        name: "Playlist",
        url: "/me?tab=playlists",
        icon: <ListVideo className="h-4 w-4" />,
      },
      {
        name: "Subscription",
        url: "/me?tab=subscribed",
        icon: <Users className="h-4 w-4" />,
      },
      {
        name: "Tweets",
        url: "/me?tab=tweets",
        icon: <MessageCircle className="h-4 w-4" />,
      },
      {
        name: "Watch History",
        url: PathConstants.WATCHHISTORY,
        icon: <History className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Subscriptions",
    isExpanded: true,
    items: [],
  },
];
