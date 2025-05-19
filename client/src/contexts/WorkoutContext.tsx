import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { workoutApi } from '../api/workout.api';
import { Workout, WorkoutInput, WorkoutContextType } from '../types/workout.types';

interface WorkoutProviderProps {
  children: ReactNode;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: WorkoutProviderProps) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const getWorkouts = async (): Promise<Workout[]> => {
    if (!token) return [];

    try {
      setIsLoading(true);
      setError(null);
      
      const data = await workoutApi.getWorkouts(token);
      setWorkouts(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getWorkout = async (id: string) => {
    if (!token) return null;

    try {
      setIsLoading(true);
      setError(null);
      
      return await workoutApi.getWorkout(id, token);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkout = async (workout: WorkoutInput) => {
    if (!token) return null;

    try {
      setIsLoading(true);
      setError(null);
      
      const newWorkout = await workoutApi.createWorkout(workout, token);
      
      if (newWorkout) {
        // Update the workouts state
        setWorkouts(prev => [...prev, newWorkout]);
      }
      
      return newWorkout;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkout = async (id: string, workout: WorkoutInput) => {
    if (!token) return null;

    try {
      setIsLoading(true);
      setError(null);
      
      const updatedWorkout = await workoutApi.updateWorkout(id, workout, token);
      
      if (updatedWorkout) {
        // Update the workouts state
        setWorkouts(prev => 
          prev.map(w => w._id === id ? updatedWorkout : w)
        );
      }
      
      return updatedWorkout;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkout = async (id: string) => {
    if (!token) return false;

    try {
      setIsLoading(true);
      setError(null);
      
      const success = await workoutApi.deleteWorkout(id, token);
      
      if (success) {
        // Update the workouts state
        setWorkouts(prev => prev.filter(w => w._id !== id));
      }
      
      return success;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      isLoading,
      error,
      getWorkouts,
      getWorkout,
      createWorkout,
      updateWorkout,
      deleteWorkout
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

// Re-export the types for convenience
export type { Workout, WorkoutInput, Exercise } from '../types/workout.types';
