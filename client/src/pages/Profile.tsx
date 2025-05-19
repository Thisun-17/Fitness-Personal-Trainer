
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleUser, User, Weight, LineChart, Goal } from 'lucide-react';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  height: z.string().optional(),
  weight: z.string().optional(),
  fitnessGoal: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, updateUserProfile, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('details');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      height: user?.height?.toString() || '',
      weight: user?.weight?.toString() || '',
      fitnessGoal: user?.fitnessGoal || '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    const userData = {
      name: values.name,
      height: values.height ? parseFloat(values.height) : undefined,
      weight: values.weight ? parseFloat(values.weight) : undefined,
      fitnessGoal: values.fitnessGoal,
    };

    await updateUserProfile(userData);
  };

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

  return (
    <div className="fitness-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and track your progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <CircleUser className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="font-bold text-lg">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="mt-4 w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Profile Completion</span>
                    <span>80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-fitness-blue h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <User className="h-4 w-4 text-fitness-blue" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Height</div>
                  <div className="font-medium">{user?.height || '—'} cm</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <Weight className="h-4 w-4 text-fitness-teal" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Weight</div>
                  <div className="font-medium">{user?.weight || '—'} kg</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-full mr-3">
                  <Goal className="h-4 w-4 text-fitness-orange" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fitness Goal</div>
                  <div className="font-medium">{getFitnessGoalDisplay(user?.fitnessGoal)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Profile Details</TabsTrigger>
              <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your profile details and fitness information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="175"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (kg)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="70"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="fitnessGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fitness Goal</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your fitness goal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                                <SelectItem value="strength">Strength</SelectItem>
                                <SelectItem value="endurance">Endurance</SelectItem>
                                <SelectItem value="flexibility">Flexibility</SelectItem>
                                <SelectItem value="general_fitness">General Fitness</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="mt-4"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Updating...' : 'Save Changes'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>
                    Track your fitness progress over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <LineChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Progress Tracking Coming Soon</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      We're working on building a comprehensive progress tracking feature to help you visualize your fitness journey.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
