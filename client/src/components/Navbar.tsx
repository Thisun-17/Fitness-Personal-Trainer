
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Home, Dumbbell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="text-2xl font-bold text-fitness-blue flex items-center gap-2"
                onClick={closeMenu}
              >
                <Dumbbell className="h-8 w-8" />
                <span>FitTrainer</span>
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/workouts" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1">
                  <Dumbbell className="h-4 w-4" />
                  <span>Workouts</span>
                </Link>
                <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  Login
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-fitness-blue hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fitness-blue"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  onClick={closeMenu}
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/workouts" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  onClick={closeMenu}
                >
                  <Dumbbell className="h-5 w-5" />
                  <span>Workouts</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
