import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../hooks/axiosInstance';
import { notification } from 'antd';

const callNotification = ((description, type) => {
  notification.open({
    message: 'info',
    description: description,
    duration: 3, // Duration in seconds, 0 means the notification won't close automatically,
    type: type,
  });
})

const initialState = {
  requests: [],
  request_loading: false,
  requests_dropdown:[],
  request_dropdown_loading: false,
  request_error: null,
};
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchRequestsAsync = createAsyncThunk('request/fetchRequests', async () => {
  try {
    const url = BACKEND_URL + '/request/fetchRequests';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const fetchRequestDropDownAsync = createAsyncThunk('request/fetchRequestByApplicationId', async (requestData) => {
  try {
    const url = BACKEND_URL + `/request/fetchRequestByApplicationId/${requestData.id}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const createRequestAsync = createAsyncThunk(
  'request/createRequest',
  async (requestData) => {
    try {
      const url = BACKEND_URL + '/request/createRequest';
      const response = await axiosInstance.post(url, requestData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const updateRequestAsync = createAsyncThunk(
  'request/updateRequest',
  async (requestData) => {
    try {
      const url = BACKEND_URL + `/request/updateRequest/${requestData.id
    }`;
      const response = await axiosInstance.put(url, requestData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const deleteRequestAsync = createAsyncThunk(
  'request/deleteRequest',
  async (requestId) => {
    try {
      const url = BACKEND_URL + `/request/deleteRequest/${ requestId } `;
      await axiosInstance.delete(url);
      return requestId;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    resetStateRequest: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchRequestDropDownAsync.pending, (state) => {
      state.request_dropdown_loading = true;
      state.error = null;
    })
    .addCase(fetchRequestDropDownAsync.fulfilled, (state, action) => {
      state.request_dropdown_loading = false;
      state.requests_dropdown = action.payload;
    })
    .addCase(fetchRequestDropDownAsync.rejected, (state, action) => {
      state.request_dropdown_loading = false;
      state.error = action.error.message;
    })
      .addCase(fetchRequestsAsync.pending, (state) => {
        state.request_loading = true;
        state.error = null;
      })
      .addCase(fetchRequestsAsync.fulfilled, (state, action) => {
        state.request_loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequestsAsync.rejected, (state, action) => {
        state.request_loading = false;
        state.error = action.error.message;
      })
      .addCase(createRequestAsync.pending, (state) => {
        state.request_loading = true;
        state.error = null;
      })
      .addCase(createRequestAsync.fulfilled, (state, action) => {
        state.request_loading = false;
        state.requests.push(action.payload);
        callNotification('Operation Successfull', 'success');
      })
      .addCase(createRequestAsync.rejected, (state, action) => {
        state.request_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      })
      .addCase(updateRequestAsync.pending, (state) => {
        state.request_loading = true;
        state.error = null;
      })
      .addCase(updateRequestAsync.fulfilled, (state, action) => {
        state.request_loading = false;
        const updatedRequest = action.payload;
        const index = state.requests.findIndex(
          (request) => request.id === updatedRequest.id
        );
        if (index !== -1) {
          state.requests[index] = updatedRequest;
        }
        callNotification('Operation Successfull', 'success');
      })
      .addCase(updateRequestAsync.rejected, (state, action) => {
        state.request_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      })
      .addCase(deleteRequestAsync.pending, (state) => {
        state.request_loading = true;
        state.error = null;
      })
      .addCase(deleteRequestAsync.fulfilled, (state, action) => {
        state.request_loading = false;
        const requestId = action.payload;
        state.requests = state.requests.filter((request) => request.id !== requestId);
        callNotification('Operation Successfull', 'success');
      })
      .addCase(deleteRequestAsync.rejected, (state, action) => {
        state.request_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      });
  },
});
export const { resetStateRequest } = requestSlice.actions;
export const requestReducer = requestSlice.reducer;