import {
  getCurrentDateString,
  getCurrentTimeString,
  formatDateToString,
  dateToString,
  extractDateFromIso,
  extractTimeFromIso,
  isDateInPast,
  isTimeInPast,
  getElementCenter,
} from "./dateTimeUtils";

describe("dateTimeUtils", () => {
  describe("formatDateToString", () => {
    it("should format date to YYYY-MM-DD string", () => {
      const date = new Date(2024, 3, 15); // April 15, 2024
      const result = formatDateToString(date);
      expect(result).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(result.split("-")[2]).toBe("15");
    });

    it("should pad single digits with zeros", () => {
      const date = new Date(2024, 0, 5); // January 5, 2024
      const result = formatDateToString(date);
      expect(result).toBe("2024-01-05");
    });

    it("should handle month 12 (December)", () => {
      const date = new Date(2024, 11, 25); // December 25, 2024
      const result = formatDateToString(date);
      expect(result).toBe("2024-12-25");
    });
  });

  describe("dateToString", () => {
    it("should convert Date object to YYYY-MM-DD string", () => {
      const date = new Date(2024, 3, 15);
      const result = dateToString(date);
      expect(result).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it("should be equivalent to formatDateToString", () => {
      const date = new Date(2024, 3, 15);
      expect(dateToString(date)).toBe(formatDateToString(date));
    });
  });

  describe("extractDateFromIso", () => {
    it("should extract date from ISO string", () => {
      const isoString = "2024-04-13T14:30:00";
      const result = extractDateFromIso(isoString);
      expect(result).toBe("2024-04-13");
    });

    it("should handle ISO string without time", () => {
      const isoString = "2024-04-13";
      const result = extractDateFromIso(isoString);
      expect(result).toBe("2024-04-13");
    });

    it("should handle Z timezone suffix", () => {
      const isoString = "2024-04-13T14:30:00Z";
      const result = extractDateFromIso(isoString);
      expect(result).toBe("2024-04-13");
    });
  });

  describe("extractTimeFromIso", () => {
    it("should extract time from ISO string", () => {
      const isoString = "2024-04-13T14:30:00";
      const result = extractTimeFromIso(isoString);
      expect(result).toBe("14:30");
    });

    it("should return empty string if no time", () => {
      const isoString = "2024-04-13";
      const result = extractTimeFromIso(isoString);
      expect(result).toBe("");
    });

    it("should handle single digit hours and minutes", () => {
      const isoString = "2024-04-13T09:05:00";
      const result = extractTimeFromIso(isoString);
      expect(result).toBe("09:05");
    });
  });

  describe("isDateInPast", () => {
    it("should return true if date is before today", () => {
      const result = isDateInPast("2024-01-01", "2024-04-13");
      expect(result).toBe(true);
    });

    it("should return false if date is today or in future", () => {
      const result = isDateInPast("2024-04-13", "2024-04-13");
      expect(result).toBe(false);
    });

    it("should return false if date is after today", () => {
      const result = isDateInPast("2024-12-31", "2024-04-13");
      expect(result).toBe(false);
    });
  });

  describe("isTimeInPast", () => {
    it("should return true if time is before current time on same date", () => {
      const result = isTimeInPast("2024-04-13", "12:00", "2024-04-13", "14:00");
      expect(result).toBe(true);
    });

    it("should return false if time is after current time on same date", () => {
      const result = isTimeInPast("2024-04-13", "16:00", "2024-04-13", "14:00");
      expect(result).toBe(false);
    });

    it("should return false if date is different from today", () => {
      const result = isTimeInPast("2024-04-14", "12:00", "2024-04-13", "14:00");
      expect(result).toBe(false);
    });

    it("should handle edge case: same time", () => {
      const result = isTimeInPast("2024-04-13", "14:00", "2024-04-13", "14:00");
      expect(result).toBe(false);
    });
  });

  describe("getCurrentDateString", () => {
    it("should return current date in YYYY-MM-DD format", () => {
      const result = getCurrentDateString();
      expect(result).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it("should return a valid date format", () => {
      const result = getCurrentDateString();
      const parts = result.split("-");
      expect(parts).toHaveLength(3);
      expect(parseInt(parts[0])).toBeGreaterThan(2000);
      expect(parseInt(parts[1])).toBeGreaterThan(0);
      expect(parseInt(parts[1])).toBeLessThanOrEqual(12);
    });
  });

  describe("getCurrentTimeString", () => {
    it("should return current time in HH:mm format", () => {
      const result = getCurrentTimeString();
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it("should have valid hours and minutes", () => {
      const result = getCurrentTimeString();
      const [hours, minutes] = result.split(":").map(Number);
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThan(24);
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(minutes).toBeLessThan(60);
    });
  });

  describe("getElementCenter", () => {
    it("should calculate center coordinates of an element", () => {
      const mockElement = {
        getBoundingClientRect: () => ({
          left: 100,
          top: 200,
          width: 50,
          height: 40,
          right: 150,
          bottom: 240,
          x: 100,
          y: 200,
          toJSON: () => ({}),
        }),
      } as HTMLElement;

      const [centerX, centerY] = getElementCenter(mockElement);
      expect(centerX).toBe(125); // 100 + 50/2
      expect(centerY).toBe(220); // 200 + 40/2
    });

    it("should handle small elements", () => {
      const mockElement = {
        getBoundingClientRect: () => ({
          left: 50,
          top: 60,
          width: 10,
          height: 10,
          right: 60,
          bottom: 70,
          x: 50,
          y: 60,
          toJSON: () => ({}),
        }),
      } as HTMLElement;

      const [centerX, centerY] = getElementCenter(mockElement);
      expect(centerX).toBe(55); // 50 + 10/2
      expect(centerY).toBe(65); // 60 + 10/2
    });
  });
});
