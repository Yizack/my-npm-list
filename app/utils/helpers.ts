export { useTimeAgo } from "@vueuse/core";

export const formatDate = (date: string | number, time: boolean | undefined = undefined) => {
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
