export const CALENDAR_TEXT = {
  today: "Today",
  prev: "Prev",
  next: "Next",
  month: "Month",
  week: "Week",
  day: "Day",
  list: "Agenda",
} as const;

export const CALENDAR_CONFIG = {
  slotDuration: "02:00:00",
  initialView: "dayGridMonth",
} as const;

export const FORM_LABELS = {
  eventName: "event name",
  eventDate: "event date",
  eventTime: "event time",
  notes: "notes",
  color: "color",
  cancel: "Cancel",
  discard: "Discard",
  save: "Save",
  edit: "Edit",
} as const;

export const ERROR_MESSAGES = {
  eventNameRequired: "Event name is required",
  eventDateRequired: "Event date is required",
  eventTimeRequired: "Event time is required",
  eventTimeInPast: "Event time cannot be in the past",
  eventDateInPast: "Event date cannot be in the past",
} as const;

export const DEFAULT_VALUES = {
  eventColor: "#3b82f6",
  eventTime: "12:00",
  maxTitleLength: 30,
} as const;

export const INPUT_NAMES = {
  eventName: "eventName",
  eventDate: "eventDate",
  eventTime: "eventTime",
  eventNotes: "eventNotes",
  eventColor: "eventColor",
} as const;

export const STYLING = {
  dayHeaderClasses: "day-header",
  dayCellClasses: "day-cell z-10",
  formPositioningOffset: 15,
  arrowSize: 10,
} as const;
