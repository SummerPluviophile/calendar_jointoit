import { Event } from "../context/EventContext";
import {
  getCurrentDateString,
  getCurrentTimeString,
  isDateInPast,
  isTimeInPast,
} from "../utils/dateTimeUtils";
import { prepareEventForSubmission } from "../utils/eventUtils";
import { ERROR_MESSAGES } from "../constants/textConstants";

/**
 * Get current date and time strings
 */
export const getDateTimeReferences = () => ({
  today: getCurrentDateString(),
  currentTime: getCurrentTimeString(),
});

/**
 * Validate form data and return errors
 */
export const validateFormData = (
  formData: Event,
  today: string,
  currentTime: string,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.title.trim()) {
    errors.title = ERROR_MESSAGES.eventNameRequired;
  }

  if (!formData.date) {
    errors.date = ERROR_MESSAGES.eventDateRequired;
  }

  if (isDateInPast(formData.date, today)) {
    errors.date = ERROR_MESSAGES.eventDateInPast;
  }

  if(!formData.time) {
	errors.time = ERROR_MESSAGES.eventTimeRequired;
  }
  
  if (
    formData.time &&
    isTimeInPast(formData.date, formData.time, today, currentTime)
  ) {
    errors.time = ERROR_MESSAGES.eventTimeInPast;
  }

  return errors;
};

/**
 * Check if form is valid
 */
export const isFormValid = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length === 0;
};

/**
 * Prepare form data for submission
 */
export const prepareFormDataForSubmission = (formData: Event): Event => {
  return prepareEventForSubmission(formData);
};

/**
 * Handle form input change
 */
export const handleFormInputChange = (
  formData: Event,
  field: keyof Event,
  value: string,
): Event => ({
  ...formData,
  [field]: value,
});
