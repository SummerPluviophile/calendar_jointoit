"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useCallback, useMemo } from "react";
import { NewEventForm } from "./NewEventForm";
import cn from "classnames";
import {
  DayCellContentArg,
  EventChangeArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core/index.js";
import { useEvents, Event } from "../context/EventContext";
import { useFormState } from "../hooks/useFormState";
import { prepareCalendarEvents, handleEventUpdate } from "./Calendar.func";
import {
  CALENDAR_TEXT,
  CALENDAR_CONFIG,
  STYLING,
} from "../constants/textConstants";
import { extractDateFromIso, extractTimeFromIso, formatDateToString, getElementCenter } from "../utils/dateTimeUtils";

export function CalendarWrapper({ classNames }: { classNames: string }) {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { state, showCellClicked, showEventClicked, closeForm } =
    useFormState();

  const handleCellClickEvent = useCallback(
    (arg: DateClickArg) => {
      const [centerX, centerY] = getElementCenter(arg.dayEl);
      showCellClicked([centerX, centerY], arg.date);
    },
    [showCellClicked],
  );

  const handleEventClickEvent = useCallback(
    (arg: EventClickArg) => {
      const [centerX, centerY] = getElementCenter(arg.el);
      const eventIndex = events.findIndex(
        (e) =>
          e.title === arg.event.title &&
          e.date === arg.event.startStr.split("T")[0],
      );

      if (eventIndex !== -1) {
        const originalEvent = events[eventIndex];
        const transformedEvent = {
          ...originalEvent,
          title: arg.event.title,
          date: extractDateFromIso(arg.event.startStr),
          time:
            arg.event.allDay || !arg.event.startStr.includes("T")
              ? ""
              : extractTimeFromIso(arg.event.startStr),
          color: arg.event.backgroundColor || originalEvent.color,
        };
        showEventClicked(
          [centerX, centerY],
          transformedEvent,
          originalEvent.id,
        );
      }
    },
    [events, showEventClicked],
  );

  const handleAddOrUpdateEvent = useCallback(
    (event: Event) => {
      if (state.selectedEventId !== null) {
        updateEvent(state.selectedEventId, event);
      } else {
        addEvent(event);
      }
      closeForm();
    },
    [state.selectedEventId, addEvent, updateEvent, closeForm],
  );

  const handleDeleteEvent = useCallback(() => {
    if (state.selectedEventId !== null) {
      deleteEvent(state.selectedEventId);
    }
    closeForm();
  }, [state.selectedEventId, deleteEvent, closeForm]);

  const calendarEvents = useMemo(() => prepareCalendarEvents(events), [events]);

  const getDayCellClasses = useCallback(
    (arg: DayCellContentArg) => {
      const classes: string[] = [STYLING.dayCellClasses];

      if (state.selectedDate) {
        const argDateString = formatDateToString(arg.date);
        const selectedDateString = formatDateToString(state.selectedDate);

        if (argDateString === selectedDateString) {
          classes.push("day-cell-active");
        }
      }

      return classes.join(" ");
    },
    [state.selectedDate],
  );

  const getEventCellClasses = useCallback(
    (arg: EventContentArg) => {
      const classes: string[] = [];
      if (state.selectedEvent) {
        if (arg.event.startStr === state.selectedEvent?.date) {
          classes.push("event-active");
        }
      }

      return classes.join(" ");
    },
    [state.selectedEvent],
  );

  const handleEventChangeCallback = useCallback(
    (arg: EventChangeArg) => {
      if (!arg.event.id) {
        console.error("Event ID is missing");
        return;
      }
      const updatedEvent = handleEventUpdate(
        arg.event.id,
        arg.event.title,
        arg.event.startStr,
        events,
      );
      updateEvent(arg.event.id, updatedEvent);
    },
    [events, updateEvent],
  );

  return (
    <div className={cn("", classNames)}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        displayEventTime={false}
        initialView={CALENDAR_CONFIG.initialView}
        editable={true}
        nowIndicator={true}
        slotDuration={CALENDAR_CONFIG.slotDuration}
        dateClick={handleCellClickEvent}
        aspectRatio={1.8}
        expandRows={true}
        eventChange={handleEventChangeCallback}
        headerToolbar={{
          left: "today,prev,next",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
          center: "title",
        }}
        buttonText={CALENDAR_TEXT}
        events={calendarEvents}
        eventClick={handleEventClickEvent}
        eventClassNames={getEventCellClasses}
        navLinks={false}
        dayHeaderClassNames={STYLING.dayHeaderClasses}
        dayCellClassNames={getDayCellClasses}
      />
      {state.showForm && (
        <NewEventForm
          onAddEvent={handleAddOrUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          shouldHide={closeForm}
          eventData={state.selectedEvent}
          cellDate={state.selectedDate}
          positionX={
            state.isEventClick
              ? state.selectedEventCoordinates[0]
              : state.cellClickCoordinates[0]
          }
          positionY={
            state.isEventClick
              ? state.selectedEventCoordinates[1]
              : state.cellClickCoordinates[1]
          }
          aria-label={state.selectedEvent ? "Edit Event" : "Create New Event"}
        />
      )}
    </div>
  );
}
