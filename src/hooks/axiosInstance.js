// axiosInstance.js

import axios from 'axios';
// import { setUser, FlushUserData } from '../store/index';
import { notification } from 'antd';
// import { setUser, FlushUserData } from '../store/index';


let store;
export const injectStore = (_store) => {
  store = _store;
};



const axiosInstance = axios.create({
  // Replace with your API base URL
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request config before sending the request
    // For example, you can add headers or authentication tokens
    // config.headers['Authorization'] = `${
    //   store.getState().auth.data.token
    //   }`;
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
      config.headers['Accept'] = '*/*'
      config.headers['mimeType'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    console.log('file')
    console.log('Request Interceptor:', config);
    return config;
  },
  (error) => {
    // Handle request error
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

const erroHandler = (description, type) => {
  const payload = {
    userName: null,
    solId: null,
    email: null,
    departmentName: null,
    token: null,
  };
  notification.open({
    message: 'info',
    description: description,
    duration: 3, // Duration in seconds, 0 means the notification won't close automatically,
    type: type,
  });
  // store.dispatch(setUser(payload));
  // store.dispatch(FlushUserData());
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Modify the response data before passing it to the .then() callback
    console.log('Response Interceptor:', response);
    if (response && response.status === 200) {
      return response;
    }
  },
  (error) => {
    // Handle response error
    console.error('Response Interceptor Error:', error);

    if (error.response && error.response.status === 404) {
      // Show an alert for a 404 error
      erroHandler(error.response, 'error');
    } else if (error.response && error.response.status === 401) {
      erroHandler('Unathorized Access', 'error');
      // store.dispatch(FlushUserData());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
