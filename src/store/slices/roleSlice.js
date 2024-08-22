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
  roles: [],
  roles_dropdown:[],
  role_loading: false,
  role_dropdown_loading: false,
  role_error: null,
};
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchRolesAsync = createAsyncThunk('role/fetchRoles', async () => {
  try {
    const url = BACKEND_URL + '/role/fetchRoles';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const fetchRolesDropDownAsync = createAsyncThunk('role/fetchRoleByApplicationId', async (roleData) => {
  try {
    const url = BACKEND_URL + `/role/fetchRoleByApplicationId/${roleData.id}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const createRoleAsync = createAsyncThunk(
  'role/createRole',
  async (roleData) => {
    try {
      const url = BACKEND_URL + '/role/createRole';
      const response = await axiosInstance.post(url, roleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const updateRoleAsync = createAsyncThunk(
  'role/updateRole',
  async (roleData) => {
    try {
      const url = BACKEND_URL + `/role/updateRole/${roleData.id
    }`;
      const response = await axiosInstance.put(url, roleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const deleteRoleAsync = createAsyncThunk(
  'role/deleteRole',
  async (roleId) => {
    try {
      const url = BACKEND_URL + `/role/deleteRole/${ roleId } `;
      await axiosInstance.delete(url);
      return roleId;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    resetStateRole: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRolesDropDownAsync.pending, (state) => {
        state.role_dropdown_loading = true;
        state.error = null;
      })
      .addCase(fetchRolesDropDownAsync.fulfilled, (state, action) => {
        state.role_dropdown_loading = false;
        state.roles_dropdown = action.payload;
      })
      .addCase(fetchRolesDropDownAsync.rejected, (state, action) => {
        state.role_dropdown_loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRolesAsync.pending, (state) => {
        state.role_loading = true;
        state.error = null;
      })
      .addCase(fetchRolesAsync.fulfilled, (state, action) => {
        state.role_loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRolesAsync.rejected, (state, action) => {
        state.role_loading = false;
        state.error = action.error.message;
      })
      .addCase(createRoleAsync.pending, (state) => {
        state.role_loading = true;
        state.error = null;
      })
      .addCase(createRoleAsync.fulfilled, (state, action) => {
        state.role_loading = false;
        state.roles.push(action.payload);
        callNotification('Operation Successfull', 'success');
      })
      .addCase(createRoleAsync.rejected, (state, action) => {
        state.role_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      })
      .addCase(updateRoleAsync.pending, (state) => {
        state.role_loading = true;
        state.error = null;
      })
      .addCase(updateRoleAsync.fulfilled, (state, action) => {
        state.role_loading = false;
        const updatedRole = action.payload;
        const index = state.roles.findIndex(
          (role) => role.id === updatedRole.id
        );
        if (index !== -1) {
          state.roles[index] = updatedRole;
        }
        callNotification('Operation Successfull', 'success');
      })
      .addCase(updateRoleAsync.rejected, (state, action) => {
        state.role_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      })
      .addCase(deleteRoleAsync.pending, (state) => {
        state.role_loading = true;
        state.error = null;
      })
      .addCase(deleteRoleAsync.fulfilled, (state, action) => {
        state.role_loading = false;
        const roleId = action.payload;
        state.roles = state.roles.filter((role) => role.id !== roleId);
        callNotification('Operation Successfull', 'success');
      })
      .addCase(deleteRoleAsync.rejected, (state, action) => {
        state.role_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      });
  },
});
export const { resetStateRole } = roleSlice.actions;
export const roleReducer = roleSlice.reducer;