
export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

export interface Workout {
  _id: string;
  title: string;
  description?: string;
  date: string;
  duration?: number;
  exercises: Exercise[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutInput {
  title: string;
  description?: string;
  date: string;
  duration?: number;
  exercises: Exercise[];
}

export interface WorkoutContextType {
  workouts: Workout[];
  isLoading: boolean;
  error: string | null;
  getWorkouts: () => Promise<Workout[]>;
  getWorkout: (id: string) => Promise<Workout | null>;
  createWorkout: (workout: WorkoutInput) => Promise<Workout | null>;
  updateWorkout: (id: string, workout: WorkoutInput) => Promise<Workout | null>;
  deleteWorkout: (id: string) => Promise<boolean>;
}
