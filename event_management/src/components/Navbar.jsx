import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CalendarIcon, UserCircleIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <CalendarIcon className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">EventHub</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center space-x-3 bg-gray-100 rounded-full py-2 px-4">
                  <UserCircleIcon className="h-6 w-6 text-gray-600" />
                  <span className="text-gray-900 font-medium">
                    {user.isGuest ? 'Guest User' : user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </motion.div>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;