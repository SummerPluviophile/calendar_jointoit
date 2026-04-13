import { useReducer, useCallback } from "react";
import { Event } from "../context/EventContext";

interface FormState {
  showForm: boolean;
  selectedDate: Date | null;
  selectedEvent: Event | null;
  selectedEventId: string | null;
  selectedEventCoordinates: [number, number];
  cellClickCoordinates: [number, number];
  isEventClick: boolean;
}

type FormAction =
  | {
      type: "SHOW_CELL_CLICKED";
      payload: {
        cellClickCoordinates: [number, number];
        selectedDate: Date;
      };
    }
  | {
      type: "SHOW_EVENT_CLICKED";
      payload: {
        selectedEventCoordinates: [number, number];
        selectedEvent: Event;
        selectedEventId: string;
      };
    }
  | { type: "CLOSE_FORM" };

const initialState: FormState = {
  showForm: false,
  selectedDate: null,
  selectedEvent: null,
  selectedEventId: null,
  selectedEventCoordinates: [0, 0],
  cellClickCoordinates: [0, 0],
  isEventClick: false,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SHOW_CELL_CLICKED":
      return {
        ...state,
        showForm: true,
        isEventClick: false,
        cellClickCoordinates: action.payload.cellClickCoordinates,
        selectedDate: action.payload.selectedDate,
        selectedEvent: null,
        selectedEventId: null,
      };
    case "SHOW_EVENT_CLICKED":
      return {
        ...state,
        showForm: true,
        isEventClick: true,
        selectedEventCoordinates: action.payload.selectedEventCoordinates,
        selectedEvent: action.payload.selectedEvent,
        selectedEventId: action.payload.selectedEventId,
        selectedDate: null,
      };
    case "CLOSE_FORM":
      return initialState;
    default:
      return state;
  }
}

/**
 * Custom hook to manage form state for calendar events form
 * Consolidates 7+ useState calls into a single useReducer
 */
export function useFormState() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const showCellClicked = useCallback(
    (cellClickCoordinates: [number, number], selectedDate: Date) => {
      dispatch({
        type: "SHOW_CELL_CLICKED",
        payload: { cellClickCoordinates, selectedDate },
      });
    },
    []
  );

  const showEventClicked = useCallback(
    (
      selectedEventCoordinates: [number, number],
      selectedEvent: Event,
      selectedEventId: string
    ) => {
      dispatch({
        type: "SHOW_EVENT_CLICKED",
        payload: {
          selectedEventCoordinates,
          selectedEvent,
          selectedEventId,
        },
      });
    },
    []
  );

  const closeForm = useCallback(() => {
    dispatch({ type: "CLOSE_FORM" });
  }, []);

  return {
    state,
    showCellClicked,
    showEventClicked,
    closeForm,
  };
}
