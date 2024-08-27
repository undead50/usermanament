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
  ApplicationOwners: [],
  ApplicationOwner_loading: false,
  ApplicationOwner_error: null,
};
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchApplicationownersAsync = createAsyncThunk('ApplicationOwner/fetchApplicationowners', async () => {
  try {
    const url = BACKEND_URL + '/ApplicationOwner/fetchApplicationowners';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const createApplicationownerAsync = createAsyncThunk(
  'ApplicationOwner/createApplicationowner',
  async (ApplicationOwnerData) => {
    try {
      const url = BACKEND_URL + '/ApplicationOwner/createApplicationowner';
      const response = await axiosInstance.post(url, ApplicationOwnerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const updateApplicationownerAsync = createAsyncThunk(
  'ApplicationOwner/updateApplicationowner',
  async (ApplicationOwnerData) => {
    try {
      const url = BACKEND_URL + `/ApplicationOwner/updateApplicationowner/${ApplicationOwnerData.id
    }`;
      const response = await axiosInstance.put(url, ApplicationOwnerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const deleteApplicationownerAsync = createAsyncThunk(
  'ApplicationOwner/deleteApplicationowner',
  async (ApplicationOwnerId) => {
    try {
      const url = BACKEND_URL + `/ApplicationOwner/deleteApplicationowner/${ ApplicationOwnerId } `;
      await axiosInstance.delete(url);
      return ApplicationOwnerId;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

const ApplicationOwnerSlice = createSlice({
  name: 'ApplicationOwner',
  initialState,
  reducers: {
    resetStateApplicationowner: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicationownersAsync.pending, (state) => {
        state.ApplicationOwner_loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationownersAsync.fulfilled, (state, action) => {
        state.ApplicationOwner_loading = false;
        state.ApplicationOwners = action.payload;
      })
      .addCase(fetchApplicationownersAsync.rejected, (state, action) => {
        state.ApplicationOwner_loading = false;
        state.error = action.error.message;
      })
      .addCase(createApplicationownerAsync.pending, (state) => {
        state.ApplicationOwner_loading = true;
        state.error = null;
      })
      .addCase(createApplicationownerAsync.fulfilled, (state, action) => {
        state.ApplicationOwner_loading = false;
        state.ApplicationOwners.push(action.payload);
        callNotification('Operation Successfull', 'success');
      })
      .addCase(createApplicationownerAsync.rejected, (state, action) => {
        state.ApplicationOwner_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      })
      .addCase(updateApplicationownerAsync.pending, (state) => {
        state.ApplicationOwner_loading = true;
        state.error = null;
      })
      .addCase(updateApplicationownerAsync.fulfilled, (state, action) => {
        state.ApplicationOwner_loading = false;
        const updatedApplicationowner = action.payload;
        const index = state.ApplicationOwners.findIndex(
          (ApplicationOwner) => ApplicationOwner.id === updatedApplicationowner.id
        );
        if (index !== -1) {
          state.ApplicationOwners[index] = updatedApplicationowner;
        }
        callNotification('Operation Successfull', 'success');
      })
      .addCase(updateApplicationownerAsync.rejected, (state, action) => {
        state.ApplicationOwner_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      })
      .addCase(deleteApplicationownerAsync.pending, (state) => {
        state.ApplicationOwner_loading = true;
        state.error = null;
      })
      .addCase(deleteApplicationownerAsync.fulfilled, (state, action) => {
        state.ApplicationOwner_loading = false;
        const ApplicationOwnerId = action.payload;
        state.ApplicationOwners = state.ApplicationOwners.filter((ApplicationOwner) => ApplicationOwner.id !== ApplicationOwnerId);
        callNotification('Operation Successfull', 'success');
      })
      .addCase(deleteApplicationownerAsync.rejected, (state, action) => {
        state.ApplicationOwner_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      });
  },
});
export const { resetStateApplicationowner } = ApplicationOwnerSlice.actions;
export const ApplicationOwnerReducer = ApplicationOwnerSlice.reducer;