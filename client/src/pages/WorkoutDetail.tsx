
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useWorkout, Workout } from '../contexts/WorkoutContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Edit, ArrowLeft, Trash2, Info, Weight, ListRestart } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const WorkoutDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkout, deleteWorkout, isLoading } = useWorkout();
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchWorkout = async () => {
      const data = await getWorkout(id);
      setWorkout(data);
    };

    fetchWorkout();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    const success = await deleteWorkout(id);
    if (success) {
      navigate('/workouts');
    }
  };

  if (isLoading || !workout) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse-light">
          <div className="w-16 h-16 border-4 border-fitness-blue rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fitness-container">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="sm" asChild className="text-gray-500">
            <Link to="/workouts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to workouts
            </Link>
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{workout.title}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/workouts/edit/${workout._id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this workout and all of its data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Workout Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-fitness-blue" />
              Workout Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {workout.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p>{workout.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-2 text-fitness-blue" />
                  <span className="text-sm font-medium text-gray-500">Date</span>
                </div>
                <p className="text-lg font-medium">{format(parseISO(workout.date), 'MMM d, yyyy')}</p>
              </div>
              {workout.duration && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-1">
                    <Clock className="h-4 w-4 mr-2 text-fitness-teal" />
                    <span className="text-sm font-medium text-gray-500">Duration</span>
                  </div>
                  <p className="text-lg font-medium">{workout.duration} min</p>
                </div>
              )}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center mb-1">
                  <ListRestart className="h-4 w-4 mr-2 text-fitness-orange" />
                  <span className="text-sm font-medium text-gray-500">Exercises</span>
                </div>
                <p className="text-lg font-medium">{workout.exercises.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">Start Workout</Button>
            <Button variant="outline" className="w-full">Log Progress</Button>
          </CardContent>
        </Card>
      </div>

      {/* Exercises */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Weight className="h-5 w-5 mr-2 text-fitness-blue" />
            Exercises
          </CardTitle>
          <CardDescription>
            {workout.exercises.length} {workout.exercises.length === 1 ? 'exercise' : 'exercises'} in this workout
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workout.exercises.length > 0 ? (
            <div className="space-y-4">
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-lg font-medium">{exercise.name}</h3>
                    <div className="flex items-center mt-1 md:mt-0">
                      <div className="bg-blue-100 text-fitness-blue text-xs px-2 py-1 rounded-md">
                        {exercise.sets} sets × {exercise.reps} reps
                      </div>
                      {exercise.weight && (
                        <div className="bg-green-100 text-fitness-teal text-xs px-2 py-1 rounded-md ml-2">
                          {exercise.weight} kg
                        </div>
                      )}
                    </div>
                  </div>
                  {exercise.notes && (
                    <p className="text-gray-500 text-sm mt-2">{exercise.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No exercises added to this workout.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutDetail;
