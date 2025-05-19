
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWorkout } from '../contexts/WorkoutContext';
import { Calendar, ChevronRight, Dumbbell, Plus, TrendingUp, UserCircle, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const { workouts, getWorkouts, isLoading } = useWorkout();
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  
  useEffect(() => {
    getWorkouts();
  }, []);

  useEffect(() => {
    if (workouts.length > 0) {
      setRecentWorkouts(workouts.slice(0, 5));
    }
  }, [workouts]);

  // Calculate fitness stats
  const totalWorkouts = workouts.length;
  const currentMonth = new Date().getMonth();
  const workoutsThisMonth = workouts.filter(workout => 
    new Date(workout.date).getMonth() === currentMonth
  ).length;
  
  // Generate chart data (workouts per week for last 8 weeks)
  const generateWorkoutChartData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 7; i >= 0; i--) {
      // Calculate date for this point (i weeks ago)
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      // Count workouts in this week
      const count = workouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
      }).length;
      
      data.push({
        week: `Week ${8-i}`,
        workouts: count
      });
    }
    
    return data;
  };

  const chartData = workouts.length > 0 ? generateWorkoutChartData() : [];
  
  // Get fitness goal display name
  const getFitnessGoalDisplay = (goalKey) => {
    const goals = {
      weight_loss: 'Weight Loss',
      muscle_gain: 'Muscle Gain',
      strength: 'Strength',
      endurance: 'Endurance',
      flexibility: 'Flexibility',
      general_fitness: 'General Fitness'
    };
    
    return goals[goalKey] || goalKey || 'Not set';
  };

  if (isLoading) {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-gray-600 mt-1">Here's an overview of your fitness journey</p>
        </div>
        <Link to="/workouts/new">
          <Button className="mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            New Workout
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{totalWorkouts}</div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-fitness-blue" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {workoutsThisMonth} workouts this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Current Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{user?.weight || '—'} <span className="text-lg">kg</span></div>
              <div className="p-2 bg-green-100 rounded-full">
                <Weight className="h-6 w-6 text-fitness-teal" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Height: {user?.height || '—'} cm
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Fitness Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold">{getFitnessGoalDisplay(user?.fitnessGoal)}</div>
              <div className="p-2 bg-orange-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-fitness-orange" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={65} className="h-2" />
              <p className="text-sm text-gray-500 mt-1">65% towards goal</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Workout Activity</CardTitle>
          <CardDescription>Your workout frequency over the past 8 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {workouts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="workouts"
                    stroke="#0EA5E9"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>No workout data available yet</p>
                <Link to="/workouts/new" className="mt-2">
                  <Button variant="outline" size="sm">
                    Create your first workout
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Workouts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>Your latest training sessions</CardDescription>
          </div>
          <Link to="/workouts">
            <Button variant="ghost" size="sm" className="text-fitness-blue">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentWorkouts.length > 0 ? (
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <Link to={`/workouts/${workout._id}`} key={workout._id}>
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <Dumbbell className="h-6 w-6 text-fitness-blue" />
                      </div>
                      <div>
                        <h4 className="font-medium">{workout.title}</h4>
                        <p className="text-sm text-gray-500">
                          {format(new Date(workout.date), 'MMM d, yyyy')} · {workout.exercises.length} exercises
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No workouts recorded yet</p>
              <Link to="/workouts/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workout
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
