import ms from "ms";

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? "" : " ago"
  }`;
};

export const truncateToUTCDateStart = (
  date?: Date | string
): Date | undefined => {
  if (!date) return undefined;
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export const truncateToUTCDateEnd = (
  date?: Date | string
): Date | undefined => {
  if (!date) return undefined;
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
};
