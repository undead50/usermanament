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
  applications: [],
  application_loading: false,
  application_error: null,
};
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchApplicationsAsync = createAsyncThunk('application/fetchApplications', async () => {
  try {
    const url = BACKEND_URL + '/application/fetchApplications';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const createApplicationAsync = createAsyncThunk(
  'application/createApplication',
  async (applicationData) => {
    try {
      const url = BACKEND_URL + '/application/createApplication';
      const response = await axiosInstance.post(url, applicationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const updateApplicationAsync = createAsyncThunk(
  'application/updateApplication',
  async (applicationData) => {
    try {
      const url = BACKEND_URL + `/application/updateApplication/${applicationData.id
    }`;
      const response = await axiosInstance.put(url, applicationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const deleteApplicationAsync = createAsyncThunk(
  'application/deleteApplication',
  async (applicationId) => {
    try {
      const url = BACKEND_URL + `/application/deleteApplication/${ applicationId } `;
      await axiosInstance.delete(url);
      return applicationId;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    resetStateApplication: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicationsAsync.pending, (state) => {
        state.application_loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationsAsync.fulfilled, (state, action) => {
        state.application_loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplicationsAsync.rejected, (state, action) => {
        state.application_loading = false;
        state.error = action.error.message;
      })
      .addCase(createApplicationAsync.pending, (state) => {
        state.application_loading = true;
        state.error = null;
      })
      .addCase(createApplicationAsync.fulfilled, (state, action) => {
        state.application_loading = false;
        state.applications.push(action.payload);
        callNotification('Operation Successfull', 'success');
      })
      .addCase(createApplicationAsync.rejected, (state, action) => {
        state.application_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      })
      .addCase(updateApplicationAsync.pending, (state) => {
        state.application_loading = true;
        state.error = null;
      })
      .addCase(updateApplicationAsync.fulfilled, (state, action) => {
        state.application_loading = false;
        const updatedApplication = action.payload;
        const index = state.applications.findIndex(
          (application) => application.id === updatedApplication.id
        );
        if (index !== -1) {
          state.applications[index] = updatedApplication;
        }
        callNotification('Operation Successfull', 'success');
      })
      .addCase(updateApplicationAsync.rejected, (state, action) => {
        state.application_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      })
      .addCase(deleteApplicationAsync.pending, (state) => {
        state.application_loading = true;
        state.error = null;
      })
      .addCase(deleteApplicationAsync.fulfilled, (state, action) => {
        state.application_loading = false;
        const applicationId = action.payload;
        state.applications = state.applications.filter((application) => application.id !== applicationId);
        callNotification('Operation Successfull', 'success');
      })
      .addCase(deleteApplicationAsync.rejected, (state, action) => {
        state.application_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      });
  },
});
export const { resetStateApplication } = applicationSlice.actions;
export const applicationReducer = applicationSlice.reducer;