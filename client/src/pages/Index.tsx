import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    // Otherwise, redirect to home page
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse-light">
        <div className="w-16 h-16 border-4 border-fitness-blue rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Index;
