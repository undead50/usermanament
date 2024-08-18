import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { notification } from 'antd';

const callNotification = ((description, type) => {
  notification.open({
    message: 'info',
    description: description,
    duration: 3, // Duration in seconds, 0 means the notification won't close automatically,
    type: type,
  });
})

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const postLoginData = createAsyncThunk('auth/postLoginData', async (data) => {
  let encodedString = btoa(`${data.username}:${data.password}`);
  try {
    const url = BACKEND_URL + '/post-login';
    const config = {
      method: 'get',
      url: url,
      headers: {
        'Authorization': `Basic ${encodedString}`,
      },
    };

    
    const response = await axios.request(config);
    // console.log(response)
    const token = response.headers.authorization;
    const empData = response.data;
    // alert(token)
    
    return { 
      code:0,
      token,
      empData };
  } catch (err) {
    throw err;
  }
});

const authSlice = createSlice({
  reducerPath: 'authreducerPath', 
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    data: null, 
    loading: false,
    error: false,
  },
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
    },
    FlushUserData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postLoginData.pending, (state) => {
        state.loading = true;
      })
      .addCase(postLoginData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Assign the entire payload as a JSON object
      })
      .addCase(postLoginData.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        if (action.meta.requestStatus === 'rejected') {
          // Handle 401 unauthorized access here
          callNotification('Unauthorized access. Please check your credentials.', 'error');
          // You may also want to dispatch a logout action or perform other actions
          // For example: dispatch(logout());
        } else {
          // Handle other errors
          callNotification(action.error.message, 'error');
        }
      });
  },
});

export const { login, logout, FlushUserData } = authSlice.actions;
export const authReducer = authSlice.reducer;
