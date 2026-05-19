import { useStore } from "../store";

export const getAccessToken = () => {
  return useStore.getState().token;
};

// For time formar "Day, Time"
export const getFormattedTime = () => {
  const now = new Date();

  return now.toLocaleString("en-IN", {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
