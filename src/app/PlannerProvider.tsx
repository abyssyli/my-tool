"use client";

import React, { createContext, useContext, useMemo, useReducer } from "react";

import { addDaysISO, todayISO } from "@/lib/dateUtils";
import type { Note, PlannerState, Task, TimeBlock } from "@/lib/plannerTypes";

type AddTaskInput = Omit<Task, "id" | "completed"> & { id?: string };
type AddNoteInput = Omit<Note, "id"> & { id?: string };
type AddTimeBlockInput = Omit<TimeBlock, "id"> & { id?: string };

type PlannerActions = {
  addTask: (input: AddTaskInput) => string;
  toggleTask: (taskId: string) => void;
  addNote: (input: AddNoteInput) => string;
  addTimeBlock: (input: AddTimeBlockInput) => string;
};

type PlannerContextValue = {
  state: PlannerState;
  actions: PlannerActions;
};

const PlannerContext = createContext<PlannerContextValue | null>(null);

type PlannerAction =
  | { type: "ADD_TASK"; task: Task }
  | { type: "TOGGLE_TASK"; taskId: string }
  | { type: "ADD_NOTE"; note: Note }
  | { type: "ADD_TIMEBLOCK"; timeBlock: TimeBlock };

const initialState: PlannerState = {
  tasks: [],
  notes: [],
  timeBlocks: [],
};

function createInitialState(): PlannerState {
  const today = todayISO();
  const yesterday = addDaysISO(today, -1);
  const tomorrow = addDaysISO(today, 1);
  const inTwoDays = addDaysISO(today, 2);
  const inThreeDays = addDaysISO(today, 3);

  function svgThumb(a: string, b: string): string {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">` +
      `<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1">` +
      `<stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
      `<rect width="96" height="96" rx="24" fill="url(#g)"/>` +
      `<path d="M30 50h36" stroke="rgba(255,255,255,0.9)" stroke-width="8" stroke-linecap="round"/>` +
      `</svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  const imgWork = svgThumb("#2F7BFF", "#6B5CFF");
  const imgLife = svgThumb("#32D74B", "#FFCC00");
  const imgPink = svgThumb("#FF2D55", "#6B5CFF");

  return {
    tasks: [
      {
        id: "seed-task-1",
        date: today,
        title: "Weekly review",
        completed: false,
        priority: "high",
        category: "work",
        imageDataUrl: imgWork,
      },
      {
        id: "seed-task-2",
        date: today,
        title: "Reply to emails",
        completed: true,
        priority: "medium",
        category: "work",
      },
      {
        id: "seed-task-3",
        date: today,
        title: "Gym session",
        completed: false,
        priority: "medium",
        category: "life",
        imageDataUrl: imgLife,
      },
      {
        id: "seed-task-4",
        date: yesterday,
        title: "Plan the week",
        completed: true,
        priority: "high",
        category: "work",
      },
      {
        id: "seed-task-5",
        date: tomorrow,
        title: "Grocery shopping",
        completed: false,
        priority: "low",
        category: "life",
      },
      {
        id: "seed-task-6",
        date: inTwoDays,
        title: "Project deep work",
        completed: false,
        priority: "high",
        category: "work",
        imageDataUrl: imgPink,
      },
      {
        id: "seed-task-7",
        date: inThreeDays,
        title: "Meal prep",
        completed: false,
        priority: "medium",
        category: "life",
        imageDataUrl: imgLife,
      },
      {
        id: "seed-task-8",
        date: inThreeDays,
        title: "Write project update",
        completed: false,
        priority: "medium",
        category: "work",
        imageDataUrl: imgWork,
      },
    ],
    notes: [
      { id: "seed-note-1", date: today, content: "Focus on the 1–2 highest leverage tasks today." },
      { id: "seed-note-2", date: tomorrow, content: "Remember to bring a water bottle and headphones." },
      { id: "seed-note-3", date: inTwoDays, content: "Keep the schedule light: one deep work block + one meeting block." },
    ],
    timeBlocks: [
      { id: "seed-block-1", date: today, start: "09:30", end: "11:00", title: "Deep work" },
      { id: "seed-block-2", date: today, start: "14:00", end: "14:30", title: "1:1 sync" },
      { id: "seed-block-3", date: tomorrow, start: "18:00", end: "19:00", title: "Workout" },
      { id: "seed-block-4", date: inTwoDays, start: "10:00", end: "11:30", title: "Design review" },
    ],
  };
}

function generateId(): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return uuid;
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function plannerReducer(state: PlannerState, action: PlannerAction): PlannerState {
  switch (action.type) {
    case "ADD_TASK":
      return { ...state, tasks: [action.task, ...state.tasks] };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, completed: !t.completed } : t,
        ),
      };
    case "ADD_NOTE":
      return { ...state, notes: [action.note, ...state.notes] };
    case "ADD_TIMEBLOCK":
      return { ...state, timeBlocks: [action.timeBlock, ...state.timeBlocks] };
    default:
      return state;
  }
}

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(plannerReducer, initialState, () => createInitialState());

  const actions = useMemo<PlannerActions>(() => {
    return {
      addTask: (input) => {
        const id = input.id ?? generateId();
        dispatch({
          type: "ADD_TASK",
          task: {
            id,
            date: input.date,
            title: input.title,
            completed: false,
            priority: input.priority,
            category: input.category,
          },
        });
        return id;
      },
      toggleTask: (taskId) => {
        dispatch({ type: "TOGGLE_TASK", taskId });
      },
      addNote: (input) => {
        const id = input.id ?? generateId();
        dispatch({ type: "ADD_NOTE", note: { id, date: input.date, content: input.content } });
        return id;
      },
      addTimeBlock: (input) => {
        const id = input.id ?? generateId();
        dispatch({
          type: "ADD_TIMEBLOCK",
          timeBlock: {
            id,
            date: input.date,
            start: input.start,
            end: input.end,
            title: input.title,
          },
        });
        return id;
      },
    };
  }, []);

  const value = useMemo<PlannerContextValue>(() => ({ state, actions }), [state, actions]);

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner(): PlannerContextValue {
  const value = useContext(PlannerContext);
  if (!value) {
    throw new Error("usePlanner must be used within PlannerProvider");
  }
  return value;
}
