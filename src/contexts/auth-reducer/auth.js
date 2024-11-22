// contexts/auth-reducer/auth.js

// action - state management
import { REGISTER, LOGIN, LOGOUT } from './actions';

// initial state
export const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// ==============================|| AUTH REDUCER ||============================== //

// auth.js// contexts/auth-reducer/auth.js

const authReducer = (state = initialState, action) => {
  console.log('Reducer received action:', action); // Log the action to check it
  console.log('Current state before action:', state); // Log the state before the action is processed

  switch (action.type) {
    case '@auth/LOGIN': // Match with the correct action type
      console.log('LOGIN action payload:', action.payload);
      localStorage.setItem('token', action.payload.token); // Store token in localStorage
      const newStateOnLogin = { ...state, isLoggedIn: true, user: action.payload.user };
      console.log('New State after Login:', newStateOnLogin);
      return newStateOnLogin;

    case '@auth/LOGOUT': // Match with the correct action type
      console.log('LOGOUT action received');
      localStorage.removeItem('token'); // Remove token on logout
      const newStateOnLogout = { ...state, isLoggedIn: false, user: null };
      console.log('New State after Logout:', newStateOnLogout);
      return newStateOnLogout;

    default:
      return state;
  }
};

export default authReducer;
