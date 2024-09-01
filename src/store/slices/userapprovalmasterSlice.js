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
  userapprovalmasters_current_handler: [],
  userapprovalmaster_request_chain:[],
  userapprovalmaster_request_chain_loading: false,
  userapprovalmaster_approved: [],
  userapprovalmaster_loading: false,
  userapprovalmasters_current_handler_loading: false,
  userapprovalmaster_error: null,
  approvalDetail: [],
  approvalDetail_loading: false,
  userapprovalmaster_approved_loading: false,
  upr_data: [],
  upr_loading: false,
};
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchUprById = createAsyncThunk(
  'user-approvals/fetchUprById',
  async (approvalId) => {
    try {
      const url = BACKEND_URL + `/user-approvals/fetchUprCbs/${approvalId}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);
export const fetchUserApprovalApproved = createAsyncThunk(
  'user-approvals/fetchUserApprovalApproved',
  async (handler) => {
    try {
      const url =
        BACKEND_URL +
        `/user-approvals/fetchApprovalApproved?current_handler=${handler}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const fetchUserapprovalmastersById = createAsyncThunk(
  'user-approvals/fetchChangeByID',
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

export const fetchUserapprovalRequestChain = createAsyncThunk(
  'user-approvals/fetchUserapprovalRequestChain',
  async (approvalId) => {
    try {
      const url =
        BACKEND_URL +
        `/user-approvals/fetchRequestChain/${approvalId}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const fetchUserapprovalmastersByCurrentHandler = createAsyncThunk(
  'user-approvals/fetchUserapprovalmastersByCurrentHandler',
  async (approvalId) => {
    try {
      const url =
        BACKEND_URL +
        `/user-approvals/fetchApprovalByCurrentHandler/${approvalId}`;
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
      const url = BACKEND_URL + `/user-approvals/${userapprovalmasterData.id}`;
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
      .addCase(fetchUserapprovalRequestChain.pending, (state) => {
        state.userapprovalmaster_request_chain_loading = true;
        state.error = null;
      })
      .addCase(fetchUserapprovalRequestChain.fulfilled, (state, action) => {
        state.userapprovalmaster_request_chain_loading = false;
        state.userapprovalmaster_request_chain = action.payload;
      })
      .addCase(fetchUserapprovalRequestChain.rejected, (state, action) => {
        state.userapprovalmaster_request_chain = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserApprovalApproved.pending, (state) => {
        state.userapprovalmaster_approved_loading = true;
        state.error = null;
      })
      .addCase(fetchUserApprovalApproved.fulfilled, (state, action) => {
        state.userapprovalmaster_approved_loading = false;
        state.userapprovalmaster_approved = action.payload;
      })
      .addCase(fetchUserApprovalApproved.rejected, (state, action) => {
        state.userapprovalmaster_approved_loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserapprovalmastersByCurrentHandler.pending, (state) => {
        state.userapprovalmasters_current_handler_loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserapprovalmastersByCurrentHandler.fulfilled,
        (state, action) => {
          state.userapprovalmasters_current_handler_loading = false;
          state.userapprovalmasters_current_handler = action.payload;
        }
      )
      .addCase(
        fetchUserapprovalmastersByCurrentHandler.rejected,
        (state, action) => {
          state.userapprovalmasters_current_handler = false;
          state.error = action.error.message;
        }
      )
      .addCase(fetchUprById.pending, (state) => {
        state.upr_loading = true;
        state.error = null;
      })
      .addCase(fetchUprById.fulfilled, (state, action) => {
        state.upr_loading = false;
        state.upr_data = action.payload;
      })
      .addCase(fetchUprById.rejected, (state, action) => {
        state.upr_loading = false;
        state.error = action.error.message;
      })
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
        callNotification('Your request has been successfully placed for approval', 'success');
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

        state.userapprovalmasters_current_handler_loading = false;
        const updatedUserapprovalmasterCurrentHandler = action.payload;
        const index1 = state.userapprovalmasters_current_handler.findIndex(
          (userapprovalmasterch) =>
            userapprovalmasterch.id ===
            updatedUserapprovalmasterCurrentHandler.id
        );
        if (index1 !== -1) {
          state.userapprovalmasters_current_handler[index1] =
            updatedUserapprovalmasterCurrentHandler;
        }

        state.userapprovalmaster_approved_loading = false;
        const updatedUserapprovalApproved = action.payload;
        const index3 = state.userapprovalmaster_approved.findIndex(
          (userapprovalapproved) =>
            userapprovalapproved.id === updatedUserapprovalApproved.id
        );
        if (index3 !== -1) {
          state.userapprovalmaster_approved[index3] =
            updatedUserapprovalApproved;
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
