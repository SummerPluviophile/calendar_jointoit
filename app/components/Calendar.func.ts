import { Event } from "../context/EventContext";
import {
  transformEventToCalendarFormat,
  buildEventFromCalendarEvent,
} from "../utils/eventUtils";
import { DEFAULT_VALUES } from "../constants/textConstants";

export const prepareCalendarEvents = (events: Event[]) => {
  return events.map(transformEventToCalendarFormat);
};

export const handleEventUpdate = (
  eventId: string,
  eventTitle: string,
  startStr: string,
  events: Event[],
): Event => {
  const originalEvent = events.find((e) => e.id === eventId);

  if (!originalEvent) {
    throw new Error(`Event with ID "${eventId}" not found`);
  }

  return buildEventFromCalendarEvent(
    eventTitle,
    startStr,
    originalEvent.color || DEFAULT_VALUES.eventColor,
    originalEvent,
  );
};
