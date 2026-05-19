"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Clock,
  Calendar,
} from "lucide-react";
import { useStore } from "@/lib/store";
import DateHelper from "@/lib/utils/date-helper";

import {
  formatCurrentTime,
  formatTodayDate,
  getFirstName,
  getGreetingWithIcon,
  getUserInitials,
  GreetingData,
  ScheduleDay,
  showRoleLabel,
} from "@/lib/utils/greetings";
import { useLogout } from "@/lib/hooks/api/auth/useAuth";
interface GreetingInfo {
  currentTime: string;
  todayDate: string;
  todayDateShort: string;
  greeting: string;
  greetingIcon: React.ReactElement;
  greetingMessage: string;
  firstName: string;
}

export const scheduleSettings: ScheduleDay[] = [
  { id: "1", day_of_week: "Sun", is_working_day: false },
  { id: "2", day_of_week: "Mon", is_working_day: true },
  { id: "3", day_of_week: "Tue", is_working_day: true },
  { id: "4", day_of_week: "Wed", is_working_day: true },
  { id: "5", day_of_week: "Thu", is_working_day: true },
  { id: "6", day_of_week: "Fri", is_working_day: true },
  { id: "7", day_of_week: "Sat", is_working_day: false },
];

const NavHeader = () => {
  const { user } = useStore((state) => state);
  const pathName = usePathname();
  const { mutate: logoutUser } = useLogout();

  const router = useRouter();
  const { setExpand, isExpand, logout, toggleLoading, isLoading } = useStore(
    (state) => state,
  );
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Time update effect
  useEffect(() => {
    const updateTime = (): void => {
      const now = new Date();
      const currentMinute = currentTime.getMinutes();
      const newMinute = now.getMinutes();

      if (currentMinute !== newMinute) {
        setCurrentTime(now);
      }
    };

    const timer = setInterval(updateTime, 5000);
    setCurrentTime(new Date());

    return () => clearInterval(timer);
  }, [currentTime.getMinutes()]);

  const handleLogout = async () => {
    await logoutUser();

    // console.log("logout done");
    // setTimeout(() => {
    //   router.refresh();
    //   router.replace("/login");
    // }, 100);
  };

  const greetingInfo: GreetingInfo = useMemo(() => {
    const greetingData: GreetingData = getGreetingWithIcon(
      currentTime,
      scheduleSettings,
    );

    return {
      currentTime: formatCurrentTime(currentTime),
      todayDate: formatTodayDate(currentTime),
      todayDateShort: DateHelper.formatForDisplay(currentTime).dateOnly,
      greeting: greetingData.greeting,
      greetingIcon: greetingData.icon,
      greetingMessage: greetingData.message,
      firstName: getFirstName(user?.name),
    };
  }, [user?.name, currentTime]);

  const userInitials: string = getUserInitials(user?.name, user?.role);

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={setExpand}
            className="sm:hidden h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-neutral-100"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} className="sm:w-5 sm:h-5" />
          </Button>

          {/* Desktop Greeting - Keep original */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2 mb-1">
              {greetingInfo.greetingIcon}
              <h1 className="text-xl font-bold text-neutral-900 font-montserrat">
                {greetingInfo.greeting}!
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm text-neutral-600 font-medium">
                {greetingInfo.greetingMessage}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Calendar size={14} />
                  <span>{greetingInfo.todayDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Clock size={14} />
                  <span>{greetingInfo.currentTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Compact Greeting - Much smaller */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center">
              {React.cloneElement(greetingInfo.greetingIcon, {})}
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-neutral-900 leading-tight">
                {greetingInfo.greeting}!
              </h2>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <div className="flex items-center gap-1">
                  <Clock size={10} />
                  <span>{greetingInfo.currentTime}</span>
                </div>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-1">
                  <Calendar size={10} />
                  <span>{greetingInfo.todayDateShort}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <DropdownMenu>
          <DropdownMenuTrigger className="child:outline-none" asChild>
            <Button
              variant="ghost"
              className="h-10 sm:h-12 pl-2 sm:pl-3 pr-1 sm:pr-2 
             hover:bg-neutral-100 rounded-lg sm:rounded-xl 
             outline-none focus:outline-none 
             focus:ring-0 focus:ring-offset-0 
             focus:border-none active:outline-none"
              aria-label="User menu"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarImage
                    src={user?.avatar}
                    alt={user?.name || "User avatar"}
                  />
                  <AvatarFallback className="bg-brand-primary text-white text-xs sm:text-sm font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-wrap flex-col text-left ">
                  <div className="text-sm font-medium text-neutral-900">
                    {user?.name || "User"}
                  </div>
                  <div className="flex flex-wrap text-xs text-neutral-600 capitalize text-wrap flex-col">
                    {showRoleLabel(user?.role)
                      .split(", ")
                      .map((item) => <span key={item}>{item}</span>) ||
                      "Employee"}
                  </div>
                </div>
                <ChevronDown
                  size={12}
                  className="text-neutral-400 sm:w-3.5 sm:h-3.5"
                />
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 sm:w-56 shadow-2xl">
            {/* Mobile: Show user info in dropdown */}
            <div className="sm:hidden">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3 p-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.avatar}
                      alt={user?.name || "User avatar"}
                    />
                    <AvatarFallback className="bg-brand-primary text-white text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-neutral-900 truncate">
                      {user?.name || "User"}
                    </div>
                    <div className="text-xs text-neutral-600 capitalize text-wrap">
                      {showRoleLabel(user?.role) || "PARTNER"}
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </div>

            {/* Desktop: Show user info in dropdown */}
            <div className="hidden sm:block">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3 p-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={user?.avatar}
                      alt={user?.name || "User avatar"}
                    />
                    <AvatarFallback className="bg-brand-primary text-white text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-base text-neutral-900 truncate line-clamp-1 ">
                      {(user?.name?.length ?? 0) > 8
                        ? user?.name?.slice(0, 8) + "..."
                        : user?.name || "User"}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-neutral-600 capitalize text-wrap">
                        {showRoleLabel(user?.role) || "Employee"}
                      </span>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer"
            >
              <User size={16} className="mr-2" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default NavHeader;
