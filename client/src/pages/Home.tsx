
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle2, Calendar, BarChart, Dumbbell, ListChecks } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-fitness-blue to-fitness-teal text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Take Control of Your Fitness Journey
              </h1>
              <p className="text-lg mb-8">
                Track workouts, monitor progress, and achieve your fitness goals with our comprehensive personal training platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-fitness-blue hover:bg-gray-100">
                    Get Started
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=500&h=500" 
                alt="Fitness Training"
                className="rounded-lg shadow-2xl h-auto max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive fitness platform provides all the tools you need to plan, track, and achieve your fitness goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-8 w-8 text-fitness-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Workout Management</h3>
              <p className="text-gray-600">
                Create, organize, and track your customized workout routines with ease.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart className="h-8 w-8 text-fitness-teal" />
              </div>
              <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your fitness journey with visual charts and detailed statistics.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ListChecks className="h-8 w-8 text-fitness-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Goal Setting</h3>
              <p className="text-gray-600">
                Define and achieve your personal fitness goals with structured planning.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Workout Calendar</h3>
              <p className="text-gray-600">
                Schedule your workouts and maintain a consistent training routine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img 
                src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&h=600" 
                alt="Fitness Benefits"
                className="rounded-lg shadow-lg h-auto max-w-full"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6">Transform Your Fitness Experience</h2>
              <p className="text-gray-600 mb-8">
                Experience a better way to achieve your fitness goals with our comprehensive platform designed for both beginners and experienced fitness enthusiasts.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-fitness-teal mr-2 flex-shrink-0 mt-1" />
                  <span>Track your workouts and monitor your progress in real-time</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-fitness-teal mr-2 flex-shrink-0 mt-1" />
                  <span>Create customized workout plans tailored to your specific goals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-fitness-teal mr-2 flex-shrink-0 mt-1" />
                  <span>Access your fitness data anytime, anywhere with our mobile-friendly platform</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-fitness-teal mr-2 flex-shrink-0 mt-1" />
                  <span>Stay motivated with visual progress tracking and milestone celebrations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-fitness-darkBlue text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their fitness routines with our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-fitness-orange hover:bg-orange-600 text-white">
                Sign Up Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="text-2xl font-bold text-white flex items-center mb-4">
                <Dumbbell className="h-8 w-8 mr-2" />
                <span>FitTrainer</span>
              </div>
              <p className="max-w-xs">
                Your all-in-one personal fitness tracking solution for achieving your health and wellness goals.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-white mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">Testimonials</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} FitTrainer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
