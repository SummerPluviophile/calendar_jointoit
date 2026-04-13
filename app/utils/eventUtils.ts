import { Event } from "../context/EventContext";
import { DEFAULT_VALUES } from "../constants/textConstants";
import {
  extractDateFromIso,
  extractTimeFromIso,
} from "./dateTimeUtils";

export const transformEventToCalendarFormat = (event: Event) => ({
  id: event.id,
  title: event.title,
  date: event.date,
  start: event.allDay ? event.date : `${event.date}T${event.time}`,
  allDay: event.allDay || false,
  backgroundColor: event.color || DEFAULT_VALUES.eventColor,
  borderColor: event.color || DEFAULT_VALUES.eventColor,
});

export const buildEventFromCalendarEvent = (
  title: string,
  startStr: string,
  backgroundColor: string | null,
  originalEvent: Event | undefined,
  allDay?: boolean,
): Event => ({
  id: originalEvent?.id || "",
  title,
  date: extractDateFromIso(startStr),
  time: allDay ? "" : (extractTimeFromIso(startStr) || DEFAULT_VALUES.eventTime),
  color: backgroundColor || DEFAULT_VALUES.eventColor,
  notes: originalEvent?.notes || "",
  allDay: allDay || originalEvent?.allDay || false,
});

export const createEmptyEvent = (): Event => ({
  id: "",
  title: "",
  date: "",
  time: "",
  notes: "",
  color: undefined,
});

export const createEventFromCellDate = (dateString: string): Event => ({
  id: "",
  title: "",
  date: dateString,
  time: "",
  notes: "",
  color: undefined,
});

export const prepareEventForSubmission = (formData: Event): Event => ({
  ...formData,
  allDay: !formData.time,
});
