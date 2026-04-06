export type Task = {
  id: string;
  date: string;
  title: string;
  completed: boolean;
  priority?: "low" | "medium" | "high";
  category?: "work" | "life";
};

export type Note = {
  id: string;
  date: string;
  content: string;
};

export type TimeBlock = {
  id: string;
  date: string;
  start: string;
  end: string;
  title: string;
};

export type PlannerState = {
  tasks: Task[];
  notes: Note[];
  timeBlocks: TimeBlock[];
};
