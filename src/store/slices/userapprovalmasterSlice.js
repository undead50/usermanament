import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../hooks/axiosInstance';
import { notification } from 'antd';

const callNotification = (description, type) => {
  notification.open({
    message: 'info',
    description: description,
    duration: 3, // Duration in seconds, 0 means the notification won't close automatically,
    type: type,
  });
};

const initialState = {
  userapprovalmasters: [],
  userapprovalmaster_loading: false,
  userapprovalmaster_error: null,
  approvalDetail:[],
  approvalDetail_loading:false

};
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchUserapprovalmastersById = createAsyncThunk(
  'change/fetchChangeByID',
  async (approvalId) => {
    try {
      const url = BACKEND_URL + `/user-approvals/${approvalId}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const fetchUserapprovalmastersAsync = createAsyncThunk(
  'userapprovalmaster/fetchUserapprovalmasters',
  async () => {
    try {
      const url = BACKEND_URL + '/user-approvals';
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const createUserapprovalmasterAsync = createAsyncThunk(
  'userapprovalmaster/createUserapprovalmaster',
  async (userapprovalmasterData) => {
    try {
      const url = BACKEND_URL + '/user-approvals';
      const response = await axiosInstance.post(url, userapprovalmasterData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const updateUserapprovalmasterAsync = createAsyncThunk(
  'userapprovalmaster/updateUserapprovalmaster',
  async (userapprovalmasterData) => {
    try {
      const url =
        BACKEND_URL +
        `/user-approvals/${userapprovalmasterData.id}`;
      const response = await axiosInstance.put(url, userapprovalmasterData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const deleteUserapprovalmasterAsync = createAsyncThunk(
  'userapprovalmaster/deleteUserapprovalmaster',
  async (userapprovalmasterId) => {
    try {
      const url =
        BACKEND_URL +
        `/userapprovalmaster/deleteUserapprovalmaster/${userapprovalmasterId} `;
      await axiosInstance.delete(url);
      return userapprovalmasterId;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

const userapprovalmasterSlice = createSlice({
  name: 'userapprovalmaster',
  initialState,
  reducers: {
    resetStateUserapprovalmaster: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserapprovalmastersById.pending, (state) => {
        state.approvalDetail_loading = true;
        state.error = null;
      })
      .addCase(fetchUserapprovalmastersById.fulfilled, (state, action) => {
        state.approvalDetail_loading = false;
        state.approvalDetail = action.payload;
      })
      .addCase(fetchUserapprovalmastersById.rejected, (state, action) => {
        state.approvalDetail_loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserapprovalmastersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserapprovalmastersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userapprovalmasters = action.payload;
      })
      .addCase(fetchUserapprovalmastersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUserapprovalmasterAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserapprovalmasterAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userapprovalmasters.push(action.payload);
        callNotification('Operation Successfull', 'success');
      })
      .addCase(createUserapprovalmasterAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      })
      .addCase(updateUserapprovalmasterAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserapprovalmasterAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUserapprovalmaster = action.payload;
        const index = state.userapprovalmasters.findIndex(
          (userapprovalmaster) =>
            userapprovalmaster.id === updatedUserapprovalmaster.id
        );
        if (index !== -1) {
          state.userapprovalmasters[index] = updatedUserapprovalmaster;
        }
        callNotification('Operation Successfull', 'success');
      })
      .addCase(updateUserapprovalmasterAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      })
      .addCase(deleteUserapprovalmasterAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserapprovalmasterAsync.fulfilled, (state, action) => {
        state.loading = false;
        const userapprovalmasterId = action.payload;
        state.userapprovalmasters = state.userapprovalmasters.filter(
          (userapprovalmaster) => userapprovalmaster.id !== userapprovalmasterId
        );
        callNotification('Operation Successfull', 'success');
      })
      .addCase(deleteUserapprovalmasterAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      });
  },
});
export const { resetStateUserapprovalmaster } = userapprovalmasterSlice.actions;
export const userapprovalmasterReducer = userapprovalmasterSlice.reducer;
