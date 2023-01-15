import { createSlice } from "@reduxjs/toolkit";

const brokerDevicesSlice = createSlice({
  name: "brokerDevices",
  initialState: new Map(),
  reducers: {
    addDevice: (state, action) => {
      const { device } = action.payload;
      state.set(device.mqttId, device);
    },

    removeDevice: (state, action) => {
      const { device } = action.payload;
      state.delete(device.mqttId, device);
    },

    updateDevice: (state, action) => {
      const { device } = action.payload;
      state.set(device.mqttId, device);
    },
  },
});

export const { addDevice, removeDevice, updateDevice } =
  brokerDevicesSlice.actions;

export const selectBrokerDevices = (state) => state.brokerDevices;

export default brokerDevicesSlice.reducer;
