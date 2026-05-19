// greetingHelpers.ts - Helper file for greeting messages and utilities

import { Sun, Coffee, Sunset } from "lucide-react";
import { ReactElement } from "react";

export interface GreetingData {
  greeting: string;
  icon: ReactElement;
  message: string;
}

export interface GreetingMessages {
  morning: string[];
  afternoon: string[];
  evening: string[];
  monday: string[];
  friday: string[];
  weekend: string[];
}

export interface ScheduleDay {
  day_of_week: string;
  is_working_day: boolean;
  id: string;
}

export const GREETING_MESSAGES: GreetingMessages = {
  morning: [
    "Ready to conquer the day?",
    "Let's make today amazing!",
    "Time to shine bright!",
    "Rise and grind!",
    "Starting fresh and strong!",
    "Today's full of possibilities!",
    "Let's tackle those goals!",
    "Morning energy is the best energy!",
    "What will you accomplish today?",
    "The early bird catches the worm!",
    "Fresh start, fresh mindset!",
    "Let's make magic happen!",
  ],
  afternoon: [
    "Hope your day is going great!",
    "Keeping the momentum going?",
    "Halfway through - you've got this!",
    "Productivity mode: ON!",
    "Crushing those afternoon tasks!",
    "Stay focused and amazing!",
    "The day is yours to own!",
    "Making progress feels good!",
    "Keep up the excellent work!",
    "Afternoon power hour!",
    "You're doing fantastic!",
    "Success is in the details!",
  ],
  evening: [
    "Winding down nicely?",
    "Time to reflect on today's wins!",
    "Almost time to relax!",
    "Finishing strong today?",
    "Hope you had a productive day!",
    "Evening brings calm and clarity!",
    "Ready to wrap up those tasks?",
    "Time flies when you're achieving!",
    "Another day, another victory!",
    "The sunset looks beautiful on success!",
    "Peace and productivity combined!",
    "Well done on today's efforts!",
  ],
  monday: [
    "Monday motivation is here!",
    "New week, new opportunities!",
    "Let's start this week strong!",
    "Monday magic begins now!",
    "Week one starts with you!",
    "Mondays are for momentum!",
  ],
  friday: [
    "Friday feels fantastic!",
    "Almost weekend time!",
    "Finishing the week like a champion!",
    "Friday energy is unmatched!",
    "Strong finish to a great week!",
    "TGIF - Time to celebrate!",
  ],
  weekend: [
    "Weekend vibes activated!",
    "Time to recharge and relax!",
    "Weekends are for winning!",
    "Balance is beautiful!",
    "Rest, reset, and recharge!",
    "Weekend wisdom awaits!",
  ],
};

/**
 * Get a random message from an array of messages
 */
export const getRandomMessage = (messagesArray: string[]): string => {
  const randomIndex = Math.floor(Math.random() * messagesArray.length);
  return messagesArray[randomIndex];
};

/**
 * Helper function to check if a date is a working day based on schedule settings
 */
export const isWorkingDay = (
  date: Date,
  scheduleSettings: ScheduleDay[],
): boolean => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = dayNames[date.getDay()];

  const scheduleDay = scheduleSettings.find(
    (schedule) => schedule.day_of_week === dayOfWeek,
  );

  return scheduleDay?.is_working_day ?? true; // Default to working day if not found
};

export const getSpecialDayMessage = (
  currentTime: Date,
  scheduleSettings: ScheduleDay[],
): string | null => {
  const dayOfWeek = currentTime.getDay();
  const isCurrentDayWorking = isWorkingDay(currentTime, scheduleSettings);

  if (!isCurrentDayWorking) {
    return getRandomMessage(GREETING_MESSAGES.weekend);
  }

  switch (dayOfWeek) {
    case 1: // Monday
      return getRandomMessage(GREETING_MESSAGES.monday);
    case 5: // Friday
      return getRandomMessage(GREETING_MESSAGES.friday);
    default:
      return null;
  }
};

export const getGreetingWithIcon = (
  currentTime: Date,
  scheduleSettings: ScheduleDay[] = [],
): GreetingData => {
  const hour = currentTime.getHours();
  const dayOfYear = Math.floor(
    (currentTime.getTime() -
      new Date(currentTime.getFullYear(), 0, 0).getTime()) /
      1000 /
      60 /
      60 /
      24,
  );

  const seed = dayOfYear * 24 + hour;

  const seededRandom = (seed: number, max: number): number => {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };

  const getSeededMessage = (messagesArray: string[], seed: number): string => {
    const index = seededRandom(seed, messagesArray.length);
    return messagesArray[index];
  };

  // Check for special day messages first (now uses schedule settings)
  const specialMessage = getSpecialDayMessage(currentTime, scheduleSettings);

  if (hour < 12) {
    return {
      greeting: "Good morning",
      icon: <Sun size={18} className="text-yellow-500" />,
      message:
        specialMessage || getSeededMessage(GREETING_MESSAGES.morning, seed),
    };
  }

  if (hour < 17) {
    return {
      greeting: "Good afternoon",
      icon: <Coffee size={18} className="text-orange-500" />,
      message:
        specialMessage || getSeededMessage(GREETING_MESSAGES.afternoon, seed),
    };
  }

  return {
    greeting: "Good evening",
    icon: <Sunset size={18} className="text-purple-500" />,
    message:
      specialMessage || getSeededMessage(GREETING_MESSAGES.evening, seed),
  };
};

/**
 * Format current time
 */
export const formatCurrentTime = (currentTime: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(currentTime);
};

/**
 * Format today's date
 */
export const formatTodayDate = (currentTime: Date): string => {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(currentTime);
};

/**
 * Get user's first name from full name
 */
export const getFirstName = (fullName?: string): string => {
  return fullName?.split(" ")[0] || "there";
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (name?: string, role?: string): string => {
  if (name) {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return role?.charAt(0).toUpperCase() || "U";
};

/**
 * Get status color classes
 */
export const getStatusColor = (status?: string): string => {
  switch (status?.toLowerCase()) {
    case "active":
      return "text-green-600 bg-green-100";
    case "inactive":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

/**
 * Get greeting with icon and truly random message (changes every render)
 * Use this if you want messages to change dynamically
 * Now uses schedule settings to determine weekend messages
 */
export const getGreetingWithRandomMessage = (
  currentTime: Date,
  scheduleSettings: ScheduleDay[] = [],
): GreetingData => {
  const hour = currentTime.getHours();

  // Check for special day messages first (now uses schedule settings)
  const specialMessage = getSpecialDayMessage(currentTime, scheduleSettings);

  if (hour < 12) {
    return {
      greeting: "Good morning",
      icon: <Sun size={18} className="text-yellow-500" />,
      message: specialMessage || getRandomMessage(GREETING_MESSAGES.morning),
    };
  }

  if (hour < 17) {
    return {
      greeting: "Good afternoon",
      icon: <Coffee size={18} className="text-orange-500" />,
      message: specialMessage || getRandomMessage(GREETING_MESSAGES.afternoon),
    };
  }

  return {
    greeting: "Good evening",
    icon: <Sunset size={18} className="text-purple-500" />,
    message: specialMessage || getRandomMessage(GREETING_MESSAGES.evening),
  };
};

export function showRoleLabel(role: string | null): string {
  if (role) {
    return role
      .split("__") // Split by double underscore
      .map(
        (part) =>
          part
            .split("_") // Split by single underscore
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(" "), // Join words with space
      )
      .join(", "); // Join roles with comma
  }
  return "";
}
