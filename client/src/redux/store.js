import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// Combine reducers (for future scalability)
const rootReducer = combineReducers({
  user: userReducer, // Add more reducers here as needed
});

// Persistence configuration
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

// Apply persistence to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer, // Apply persisted reducer to the store
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false, // Disable serializable check (needed for non-serializable values in state like Dates)
  }),
});

// Create a persistor object
export const persistor = persistStore(store);
