import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse } from "@/types/APIResponse";
import { logout } from "@/features/authSlice";
import { useAppDispatch } from "@/hooks/useStore";

type ProfileDropdownProps = { avatarUrl: string };

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ avatarUrl }) => {
  const [isLogoutInProgress, setIsLogoutInProgress] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const logoutHandler = async () => {
    setIsLogoutInProgress(true);

    try {
      const res = await AxiosAPIInstance.get<APIResponse<null>>(
        "/api/v1/user/logout"
      );

      if (res.data.statusCode === 200) {
        dispatch(logout());
        toast({
          title: res.data.message,
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLogoutInProgress(false);
    }
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="rounded-full p-0 h-9 w-9">
          <Avatar>
            <AvatarImage src={avatarUrl} alt="AC" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-40 flex flex-col">
        <Button disabled={isLogoutInProgress} onClick={logoutHandler}>
          <LogOut />
          {isLogoutInProgress ? "Logging out.." : "Logout"}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileDropdown;
