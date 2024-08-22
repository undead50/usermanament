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
  services: [],
  service_loading: false,
  service_dropdown:[],
  service_dropdown_loading: false,
  service_error: null,
};
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchServicesAsync = createAsyncThunk('service/fetchServices', async () => {
  try {
    const url = BACKEND_URL + '/service/fetchServices';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const fetchServicesDropDownAsync = createAsyncThunk('service/fetchServiceByRoleId', async (serviceData) => {
  try {
    const url = BACKEND_URL + `/service/fetchServiceByRoleId/${serviceData.id}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const createServiceAsync = createAsyncThunk(
  'service/createService',
  async (serviceData) => {
    try {
      const url = BACKEND_URL + '/service/createService';
      const response = await axiosInstance.post(url, serviceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const updateServiceAsync = createAsyncThunk(
  'service/updateService',
  async (serviceData) => {
    try {
      const url = BACKEND_URL + `/service/updateService/${serviceData.id
    }`;
      const response = await axiosInstance.put(url, serviceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const deleteServiceAsync = createAsyncThunk(
  'service/deleteService',
  async (serviceId) => {
    try {
      const url = BACKEND_URL + `/service/deleteService/${ serviceId } `;
      await axiosInstance.delete(url);
      return serviceId;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    resetStateService: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicesDropDownAsync.pending, (state) => {
        state.service_dropdown_loading = true;
        state.error = null;
      })
      .addCase(fetchServicesDropDownAsync.fulfilled, (state, action) => {
        state.service_dropdown_loading = false;
        state.service_dropdown = action.payload;
      })
      .addCase(fetchServicesDropDownAsync.rejected, (state, action) => {
        state.service_dropdown_loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchServicesAsync.pending, (state) => {
        state.service_loading = true;
        state.error = null;
      })
      .addCase(fetchServicesAsync.fulfilled, (state, action) => {
        state.service_loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServicesAsync.rejected, (state, action) => {
        state.service_loading = false;
        state.error = action.error.message;
      })
      .addCase(createServiceAsync.pending, (state) => {
        state.service_loading = true;
        state.error = null;
      })
      .addCase(createServiceAsync.fulfilled, (state, action) => {
        state.service_loading = false;
        state.services.push(action.payload);
        callNotification('Operation Successfull', 'success');
      })
      .addCase(createServiceAsync.rejected, (state, action) => {
        state.service_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      })
      .addCase(updateServiceAsync.pending, (state) => {
        state.service_loading = true;
        state.error = null;
      })
      .addCase(updateServiceAsync.fulfilled, (state, action) => {
        state.service_loading = false;
        const updatedService = action.payload;
        const index = state.services.findIndex(
          (service) => service.id === updatedService.id
        );
        if (index !== -1) {
          state.services[index] = updatedService;
        }
        callNotification('Operation Successfull', 'success');
      })
      .addCase(updateServiceAsync.rejected, (state, action) => {
        state.service_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      })
      .addCase(deleteServiceAsync.pending, (state) => {
        state.service_loading = true;
        state.error = null;
      })
      .addCase(deleteServiceAsync.fulfilled, (state, action) => {
        state.service_loading = false;
        const serviceId = action.payload;
        state.services = state.services.filter((service) => service.id !== serviceId);
        callNotification('Operation Successfull', 'success');
      })
      .addCase(deleteServiceAsync.rejected, (state, action) => {
        state.service_loading = false;
        state.error = action.error.message;
        callNotification(state.error, 'error');
      });
  },
});
export const { resetStateService } = serviceSlice.actions;
export const serviceReducer = serviceSlice.reducer;