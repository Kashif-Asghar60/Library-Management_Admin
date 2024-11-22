/* // contexts/auth-reducer/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth'; // Import your auth reducer

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer // Add your reducers here
  }
});

// Log whenever the store is created
console.log('Store initialized with state: ', store.getState());

export default store;
 */
