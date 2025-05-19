
import axios from 'axios';
import { toast } from 'sonner';
import { Workout, WorkoutInput } from '../types/workout.types';

const API_URL = "http://localhost:5000/api";

export const workoutApi = {
  getWorkouts: async (token: string): Promise<Workout[]> => {
    if (!token) {
      toast.error("You must be logged in to view workouts");
      return [];
    }

    try {
      const response = await axios.get(`${API_URL}/workouts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch workouts';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  },

  getWorkout: async (id: string, token: string): Promise<Workout | null> => {
    if (!token) {
      toast.error("You must be logged in to view workout details");
      return null;
    }

    try {
      const response = await axios.get(`${API_URL}/workouts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch workout';
      toast.error(errorMsg);
      return null;
    }
  },

  createWorkout: async (workout: WorkoutInput, token: string): Promise<Workout | null> => {
    if (!token) {
      toast.error("You must be logged in to create a workout");
      return null;
    }

    try {
      const response = await axios.post(`${API_URL}/workouts`, workout, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success("Workout created successfully");
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create workout';
      toast.error(errorMsg);
      return null;
    }
  },

  updateWorkout: async (id: string, workout: WorkoutInput, token: string): Promise<Workout | null> => {
    if (!token) {
      toast.error("You must be logged in to update a workout");
      return null;
    }

    try {
      const response = await axios.put(`${API_URL}/workouts/${id}`, workout, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success("Workout updated successfully");
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update workout';
      toast.error(errorMsg);
      return null;
    }
  },

  deleteWorkout: async (id: string, token: string): Promise<boolean> => {
    if (!token) {
      toast.error("You must be logged in to delete a workout");
      return false;
    }

    try {
      await axios.delete(`${API_URL}/workouts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success("Workout deleted successfully");
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete workout';
      toast.error(errorMsg);
      return false;
    }
  }
};
