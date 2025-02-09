const USER_KEY = 'user';

// Save user to localStorage
const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Fetch user from localStorage
const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Remove user from localStorage
const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const Auth = {
    isLoggedIn: () => {
        return getUser() !== null && getUser().token !== null;
    },
    logout: () => {
        removeUser();
    },
    getUser: () => {
        return getUser();
    }
}