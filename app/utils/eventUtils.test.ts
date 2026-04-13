import {
  transformEventToCalendarFormat,
  buildEventFromCalendarEvent,
  createEmptyEvent,
  createEventFromCellDate,
  prepareEventForSubmission,
} from "./eventUtils";
import { Event } from "../context/EventContext";
import { DEFAULT_VALUES } from "../constants/textConstants";

describe("eventUtils", () => {
  describe("transformEventToCalendarFormat", () => {
    it("should transform event with time to calendar format", () => {
      const event: Event = {
        id: "1",
        title: "Meeting",
        date: "2024-04-13",
        time: "14:30",
        notes: "Important meeting",
        color: "#FF0000",
      };

      const result = transformEventToCalendarFormat(event);

      expect(result.title).toBe("Meeting");
      expect(result.start).toBe("2024-04-13T14:30");
      expect(result.backgroundColor).toBe("#FF0000");
      expect(result.allDay).toBe(false);
    });

    it("should transform all-day event correctly", () => {
      const event: Event = {
        id: "1",
        title: "Birthday",
        date: "2024-04-13",
        time: "",
        allDay: true,
      };

      const result = transformEventToCalendarFormat(event);

      expect(result.start).toBe("2024-04-13");
      expect(result.allDay).toBe(true);
    });

    it("should use default color if not provided", () => {
      const event: Event = {
        id: "1",
        title: "Event",
        date: "2024-04-13",
        time: "10:00",
      };

      const result = transformEventToCalendarFormat(event);

      expect(result.backgroundColor).toBe(DEFAULT_VALUES.eventColor);
      expect(result.borderColor).toBe(DEFAULT_VALUES.eventColor);
    });
  });

  describe("buildEventFromCalendarEvent", () => {
    it("should build event from calendar event data", () => {
      const originalEvent: Event = {
        id: "1",
        title: "Meeting",
        date: "2024-04-13",
        time: "14:30",
        notes: "Original notes",
        color: "#FF0000",
      };

      const result = buildEventFromCalendarEvent(
        "Meeting",
        "2024-04-13T14:30:00",
        "#0000FF",
        originalEvent,
        false
      );

      expect(result.title).toBe("Meeting");
      expect(result.date).toBe("2024-04-13");
      expect(result.time).toBe("14:30");
      expect(result.color).toBe("#0000FF");
      expect(result.notes).toBe("Original notes");
    });

    it("should handle all-day events", () => {
      const result = buildEventFromCalendarEvent(
        "Birthday",
        "2024-04-13",
        "#FF0000",
        undefined,
        true
      );

      expect(result.allDay).toBe(true);
      expect(result.time).toBe("");
    });

    it("should use default color if not provided", () => {
      const result = buildEventFromCalendarEvent(
        "Event",
        "2024-04-13T10:00:00",
        null,
        undefined,
        false
      );

      expect(result.color).toBe(DEFAULT_VALUES.eventColor);
    });

    it("should use default time if not provided", () => {
      const result = buildEventFromCalendarEvent(
        "Event",
        "2024-04-13",
        "#FF0000",
        undefined,
        true
      );

      expect(result.time).toBe("");
    });
  });

  describe("createEmptyEvent", () => {
    it("should create an empty event object", () => {
      const result = createEmptyEvent();

      expect(result.title).toBe("");
      expect(result.date).toBe("");
      expect(result.time).toBe("");
      expect(result.notes).toBe("");
      expect(result.color).toBeUndefined();
    });

    it("should return a valid Event object", () => {
      const event = createEmptyEvent();
      expect(event).toHaveProperty("title");
      expect(event).toHaveProperty("date");
      expect(event).toHaveProperty("time");
      expect(event).toHaveProperty("notes");
      expect(event).toHaveProperty("color");
    });
  });

  describe("createEventFromCellDate", () => {
    it("should create event with provided date", () => {
      const result = createEventFromCellDate("2024-04-13");

      expect(result.title).toBe("");
      expect(result.date).toBe("2024-04-13");
      expect(result.time).toBe("");
      expect(result.notes).toBe("");
    });

    it("should handle different date formats", () => {
      const result = createEventFromCellDate("2024-12-25");
      expect(result.date).toBe("2024-12-25");
    });
  });

  describe("prepareEventForSubmission", () => {
    it("should mark event as all-day when no time is provided", () => {
      const event: Event = {
        id: "1",
        title: "Event",
        date: "2024-04-13",
        time: "",
        notes: "",
      };

      const result = prepareEventForSubmission(event);

      expect(result.allDay).toBe(true);
    });

    it("should mark event as not all-day when time is provided", () => {
      const event: Event = {
        id: "1",
        title: "Event",
        date: "2024-04-13",
        time: "14:30",
        notes: "",
      };

      const result = prepareEventForSubmission(event);

      expect(result.allDay).toBe(false);
    });

    it("should preserve other event properties", () => {
      const event: Event = {
        id: "1",
        title: "Meeting",
        date: "2024-04-13",
        time: "14:30",
        notes: "Important",
        color: "#FF0000",
      };

      const result = prepareEventForSubmission(event);

      expect(result.title).toBe("Meeting");
      expect(result.date).toBe("2024-04-13");
      expect(result.notes).toBe("Important");
      expect(result.color).toBe("#FF0000");
    });

    it("should preserve id in the event", () => {
      const event: Event = {
        id: "unique-id-123",
        title: "Event",
        date: "2024-04-13",
        time: "14:30",
      };

      const result = prepareEventForSubmission(event);

      expect(result.id).toBe("unique-id-123");
    });
  });
});
