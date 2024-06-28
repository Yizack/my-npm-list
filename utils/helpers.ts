export const formatDate = (date: string | number, time = undefined) => {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: time ? "numeric" : undefined,
    minute: time ? "2-digit" : undefined,
    hour12: time ? false : undefined
  });
};

export const normalize = (string: string) => {
  return string.normalize("NFD").replace(/[\u0300-\u036F]/g, "");
};

export const getTimeAgo = (date: string | number) => {
  const floor = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  const seconds = floor < 0 ? 0 : floor;
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return `${interval} year${interval > 1 ? "s" : ""} ago`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} month${interval > 1 ? "s" : ""} ago`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} day${interval > 1 ? "s" : ""} ago`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} hour${interval > 1 ? "s" : ""} ago`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} minute${interval > 1 ? "s" : ""} ago`;
  }
  return `${Math.floor(seconds)} second${seconds > 1 || seconds === 0 ? "s" : ""} ago`;
};
