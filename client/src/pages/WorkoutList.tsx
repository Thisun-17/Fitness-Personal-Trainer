
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkout, Workout } from '../contexts/WorkoutContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ChevronRight, Clock, Dumbbell, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const WorkoutList = () => {
  const { workouts, getWorkouts, isLoading } = useWorkout();
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getWorkouts();
  }, []);

  useEffect(() => {
    // Filter workouts based on search term
    let filtered = [...workouts];
    
    if (searchTerm) {
      filtered = filtered.filter(workout => 
        workout.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (workout.description && workout.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort workouts
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      switch (sortOrder) {
        case 'newest':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'most-exercises':
          return b.exercises.length - a.exercises.length;
        default:
          return dateB - dateA;
      }
    });
    
    setFilteredWorkouts(filtered);
  }, [workouts, searchTerm, sortOrder]);

  return (
    <div className="fitness-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Workouts</h1>
          <p className="text-gray-600 mt-1">Manage and track all your workouts</p>
        </div>
        <Link to="/workouts/new">
          <Button className="mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            New Workout
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search workouts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                <SelectItem value="most-exercises">Most Exercises</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <Select defaultValue="all-time">
                  <SelectTrigger>
                    <SelectValue placeholder="All time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Exercise Type</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All exercises" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exercises</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end items-end">
                <Button variant="outline" size="sm">Apply Filters</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Workouts */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse-light">
            <div className="w-16 h-16 border-4 border-fitness-blue rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      ) : (
        <>
          {filteredWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkouts.map((workout) => (
                <Link to={`/workouts/${workout._id}`} key={workout._id}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="bg-blue-50 p-2 rounded-md">
                          <Dumbbell className="h-5 w-5 text-fitness-blue" />
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(parseISO(workout.date), 'MMM d, yyyy')}
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2">{workout.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {workout.description || 'No description provided.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <Dumbbell className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{workout.exercises.length} exercises</span>
                        </div>
                        {workout.duration && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{workout.duration} min</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="ghost" size="sm" className="text-fitness-blue">
                          View Details <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No workouts found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Try adjusting your search or filters' : "You haven't created any workouts yet"}
              </p>
              <Link to="/workouts/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Workout
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkoutList;
