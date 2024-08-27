import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createTransform,
} from 'redux-persist';

import { login, logout, FlushUserData, authReducer } from './slices/authSlice';
import { setUser, userReducer } from './slices/userSlice';
import { branchReducer } from './slices/branchSlice';

import { enc, AES } from 'crypto-js';
import { employeeReducer } from './slices/employeeSlice';
import { applicationReducer } from './slices/applicationSlice';
import { requestReducer } from './slices/requestSlice';
import { roleReducer } from './slices/roleSlice';
import { serviceReducer } from './slices/serviceSlice';
import { userapprovalmasterReducer } from './slices/userapprovalmasterSlice';
import { ApplicationOwnerReducer } from './slices/ApplicationOwnerSlice';

const secretKey = '081fbadce74f99af29c8280fce633fb9';

// Encrypt and decrypt functions using crypto-js
const encrypt = (data) =>
  AES.encrypt(JSON.stringify(data), secretKey).toString();
const decrypt = (cipherText) =>
  JSON.parse(AES.decrypt(cipherText, secretKey).toString(enc.Utf8));

const encryptor = createTransform(
  (inboundState, key) => encrypt(inboundState), // Encrypt the inbound state
  (outboundState, key) => decrypt(outboundState) // Decrypt the outbound state
);
const rootReducer = combineReducers({
  auth:authReducer,
  service: serviceReducer,
  role: roleReducer,
  request: requestReducer,
  application: applicationReducer,
  employee: employeeReducer,
  user: userReducer,
  branch: branchReducer,
  userapprovalmaster: userapprovalmasterReducer,
});
const persistConfig = {
  key: 'root_user_approval',
  storage,
  transforms: [encryptor], // Use the encryptTransform directly
  whitelist: ['branch', 'auth', 'user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: true, // Disable Redux DevTools
});

export const persistor = persistStore(store);
export { login, logout, setUser, FlushUserData };
