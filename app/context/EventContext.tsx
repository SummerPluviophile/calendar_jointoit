"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  notes?: string;
  color?: string;
  allDay?: boolean;
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Event) => void;
  deleteEvent: (id: string) => void;
  isLoading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEY = "calendar_events";

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadEvents = () => {
      try {
        if (typeof window === "undefined") return;
        const stored = localStorage.getItem(STORAGE_KEY);
        const newEvents: Event[] = [];
        if (stored) {
          newEvents.push(...JSON.parse(stored));
        }
        setEvents(newEvents);
      } catch (e) {
        console.error("Failed to parse stored events:", e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      } catch (e) {
        console.error("Failed to save events to localStorage:", e);
      }
    }
  }, [events, isLoaded]);

  const addEvent = (event: Event) => {
    const eventWithId: Event = {
      ...event,
      id: event.id || crypto.randomUUID(),
    };
    setEvents([...events, eventWithId]);
  };

  const updateEvent = (id: string, event: Event) => {
    setEvents(events.map(e => (e.id === id ? { ...event, id } : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent, isLoading: !isLoaded }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
}
