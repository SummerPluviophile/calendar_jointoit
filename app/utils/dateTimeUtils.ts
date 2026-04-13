export const getCurrentDateString = (): string => {
  const now = new Date();
  return formatDateToString(now);
};

export const getCurrentTimeString = (): string => {
  return new Date().toTimeString().slice(0, 5);
};

export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const dateToString = (date: Date): string => {
  return formatDateToString(date);
};

export const extractDateFromIso = (isoString: string): string => {
  return isoString.split("T")[0];
};

export const extractTimeFromIso = (isoString: string): string => {
  const timePart = isoString.split("T")[1];
  if (!timePart) return "";
  return timePart.split(":").slice(0, 2).join(":");
};

export const isDateInPast = (dateString: string, today: string): boolean => {
  return dateString < today;
};

export const isTimeInPast = (
  dateString: string,
  timeString: string,
  today: string,
  currentTime: string,
): boolean => {
  return dateString === today && timeString < currentTime;
};

export const getElementCenter = (
  element: HTMLElement,
): [number, number] => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return [centerX, centerY];
};
