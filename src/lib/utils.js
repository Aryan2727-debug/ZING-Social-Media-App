import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
};

export const convertFileToUrl = (file) => URL.createObjectURL(file);

export function formatDateString(dateString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
};

export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const difference = now - date;

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
  if (months > 0) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
  if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  }
  if (seconds > 0) {
    return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
  }

  return 'Just now';
};

export const checkIsLiked = (likeList, userId) => {
  return likeList.includes(userId);
};
