/* eslint-disable react-hooks/set-state-in-effect */
import Image from "next/image";
import cross from "@/public/blocking.png";
import { useState, useEffect } from "react";
import { Event } from "../context/EventContext";
import { FormInput } from "./FormInput";
import { ColorPicker } from "./ColorPicker";
import {
  validateFormData,
  isFormValid,
  prepareFormDataForSubmission,
  handleFormInputChange,
  getDateTimeReferences,
} from "./NewEventForm.func";
import { FORM_LABELS, INPUT_NAMES, DEFAULT_VALUES } from "../constants/textConstants";
import { dateToString } from "../utils/dateTimeUtils";

interface NewEventFormProps {
  onAddEvent: (event: Event) => void;
  onDeleteEvent?: () => void;
  shouldHide: () => void;
  eventData?: Event | null;
  cellDate?: Date | null;
  positionX?: number;
  positionY?: number;
  "aria-label"?: string;
}

export function NewEventForm({
  onAddEvent,
  onDeleteEvent,
  shouldHide,
  eventData,
  cellDate,
  positionX = 0,
  positionY = 0,
  "aria-label": ariaLabel,
}: NewEventFormProps) {
  const [formData, setFormData] = useState<Event>({
    id: "",
    title: "",
    date: "",
    time: "",
    notes: "",
    color: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { today, currentTime } = getDateTimeReferences();

  // Update form data when event data or cell date changes
  useEffect(() => {
    if (eventData?.date) {
      setFormData({
        id: eventData.id,
        date: eventData.date,
        time: eventData.time,
        title: eventData.title,
        notes: eventData.notes,
        color: eventData.color,
      });
    } else if (cellDate) {
      const dateString = dateToString(cellDate);
      setFormData({
        id: "",
        title: "",
        date: dateString,
        time: "",
        notes: "",
        color: undefined,
      });
    }
  }, [cellDate, eventData]);

  const handleValidation = () => {
    const formErrors = validateFormData(formData, today, currentTime);
    setErrors(formErrors);
    return isFormValid(formErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!handleValidation()) {
      return;
    }

    const eventToSubmit = prepareFormDataForSubmission(formData);
    onAddEvent(eventToSubmit);
  };

  const handleInputChange = (field: keyof Event, value: string) => {
    setFormData(handleFormInputChange(formData, field, value));
  };

  return (
    <form
      style={{
        position: "absolute",
        left: `${positionX}px`,
        top: `${positionY + 15}px`,
        transform: "translate(-50%, 0)",
        zIndex: 50,
      }}
      className="bg-form form-animated"
      onSubmit={handleSubmit}
      role="dialog"
      aria-label={ariaLabel || (eventData ? "Edit Event" : "Create New Event")}
      aria-modal="true"
    >
      <div className={"arrow-up"} />
      <Image
        src={cross.src}
        alt="Close form"
        className="icon-muted absolute top-2 right-2 cursor-pointer"
        width={24}
        height={24}
        onClick={shouldHide}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            shouldHide();
          }
        }}
      />
      <div className="flex flex-col gap-3 items-center">
        <FormInput
          type="text"
          label={FORM_LABELS.eventName}
          id={INPUT_NAMES.eventName}
          value={formData.title}
          maxLength={DEFAULT_VALUES.maxTitleLength}
          onChange={(e) => handleInputChange("title", e.target.value)}
          error={errors.title}
        />
        <FormInput
          type="date"
          label={FORM_LABELS.eventDate}
          id={INPUT_NAMES.eventDate}
          value={formData.date}
          onChange={(e) => handleInputChange("date", e.target.value)}
          error={errors.date}
        />
        <FormInput
          type="time"
          label={FORM_LABELS.eventTime}
          id={INPUT_NAMES.eventTime}
          value={formData.time}
          onChange={(e) => handleInputChange("time", e.target.value)}
          error={errors.time}
        />
        <FormInput
          type="text"
          label={FORM_LABELS.notes}
          id={INPUT_NAMES.eventNotes}
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          style={{ fontStyle: "italic" }}
        />
        <ColorPicker
          value={formData.color}
          onChange={(color) => handleInputChange("color", color)}
        />
      </div>
      <div className="flex justify-between mt-2">
        <button
          type="button"
          className="button-hover button-hover-error p-3 cursor-pointer rounded-lg"
          onClick={eventData && onDeleteEvent ? onDeleteEvent : shouldHide}
        >
          {eventData ? FORM_LABELS.discard : FORM_LABELS.cancel}
        </button>
        <button
          type="submit"
          className="button-hover p-3 cursor-pointer rounded-lg"
        >
          {eventData ? FORM_LABELS.edit : FORM_LABELS.save}
        </button>
      </div>
    </form>
  );
}
