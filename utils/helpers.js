export const formatDate = (date, time = undefined) => {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: time ? "numeric" : undefined,
    minute: time ? "2-digit" : undefined,
    hour12: time ? false : undefined
  });
};

export const normalize = (string) => {
  return string.normalize("NFD").replace(/[\u0300-\u036F]/g, "");
};
