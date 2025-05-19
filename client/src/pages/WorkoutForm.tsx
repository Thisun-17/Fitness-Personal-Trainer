
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkout, Exercise, Workout } from '../contexts/WorkoutContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Plus, Save, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';

const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.number().min(1, 'Sets must be at least 1'),
  reps: z.number().min(1, 'Reps must be at least 1'),
  weight: z.number().optional(),
  duration: z.number().optional(),
  notes: z.string().optional(),
});

const workoutSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  duration: z.number().optional(),
  exercises: z.array(exerciseSchema).min(1, 'At least one exercise is required'),
});

type WorkoutFormValues = z.infer<typeof workoutSchema>;

const WorkoutForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkout, createWorkout, updateWorkout, isLoading } = useWorkout();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const isEditing = !!id;

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      duration: undefined,
      exercises: [{ name: '', sets: 3, reps: 10 }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  useEffect(() => {
    if (isEditing && id) {
      const fetchWorkout = async () => {
        const data = await getWorkout(id);
        if (data) {
          setWorkout(data);
          // Format the date to YYYY-MM-DD for input
          const formattedDate = format(new Date(data.date), 'yyyy-MM-dd');
          
          form.reset({
            title: data.title,
            description: data.description || '',
            date: formattedDate,
            duration: data.duration,
            exercises: data.exercises.map(exercise => ({
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight,
              duration: exercise.duration,
              notes: exercise.notes || ''
            }))
          });
        }
      };

      fetchWorkout();
    }
  }, [id, isEditing]);

  const addExercise = () => {
    append({
      name: '',
      sets: 3,
      reps: 10,
      weight: undefined,
      duration: undefined,
      notes: ''
    });
  };

  const onSubmit = async (values: WorkoutFormValues) => {
    // Ensure all required fields are present for WorkoutInput
    const workoutData = {
      title: values.title, // Explicitly add title as it's required
      description: values.description,
      date: values.date, // Explicitly include date as it's required
      duration: values.duration,
      exercises: values.exercises.map(exercise => ({
        name: exercise.name, // Ensure name is included
        sets: exercise.sets, // Ensure sets is included
        reps: exercise.reps, // Ensure reps is included
        weight: exercise.weight,
        duration: exercise.duration,
        notes: exercise.notes || undefined
      }))
    };
    
    if (isEditing && id) {
      await updateWorkout(id, workoutData);
      navigate(`/workouts/${id}`);
    } else {
      const newWorkout = await createWorkout(workoutData);
      if (newWorkout) {
        navigate(`/workouts/${newWorkout._id}`);
      }
    }
  };

  return (
    <div className="fitness-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{isEditing ? 'Edit Workout' : 'Create Workout'}</h1>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Update your existing workout' : 'Plan a new workout session'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workout Information</CardTitle>
          <CardDescription>
            Enter the details for your workout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Monday Full Body"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="date"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 60"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value ? parseInt(e.target.value) : undefined;
                              field.onChange(value);
                            }}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add notes about this workout..."
                          className="h-[158px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Exercises</h3>
                  <Button type="button" variant="outline" onClick={addExercise}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>

                {fields.length > 0 ? (
                  <div className="space-y-6">
                    {fields.map((field, index) => (
                      <Card key={field.id}>
                        <CardHeader className="pb-0 pt-4 px-4">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">
                              Exercise {index + 1}
                            </CardTitle>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => remove(index)}
                              className="text-red-500 h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-4 pt-2 px-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name={`exercises.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Exercise Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., Barbell Squat"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`exercises.${index}.sets`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Sets</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => {
                                          const value = e.target.value ? parseInt(e.target.value) : 0;
                                          field.onChange(value);
                                        }}
                                        value={field.value || 0}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`exercises.${index}.reps`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Reps</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => {
                                          const value = e.target.value ? parseInt(e.target.value) : 0;
                                          field.onChange(value);
                                        }}
                                        value={field.value || 0}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
                            <FormField
                              control={form.control}
                              name={`exercises.${index}.weight`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Weight (kg) - Optional</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="e.g., 50"
                                      {...field}
                                      onChange={(e) => {
                                        const value = e.target.value ? parseInt(e.target.value) : undefined;
                                        field.onChange(value);
                                      }}
                                      value={field.value || ''}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name={`exercises.${index}.notes`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Notes - Optional</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., Focus on form"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No exercises added yet. Add your first exercise!</p>
                  </div>
                )}

                {form.formState.errors.exercises?.root && (
                  <p className="text-sm font-medium text-red-500 mt-2">
                    {form.formState.errors.exercises.root.message}
                  </p>
                )}

                <div className="mt-6 flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(isEditing ? `/workouts/${id}` : '/workouts')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? 'Update' : 'Create'} Workout
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutForm;
