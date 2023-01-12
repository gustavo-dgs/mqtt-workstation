import { createSlice } from "@reduxjs/toolkit";

const mainNodesSlice = createSlice({
  name: "mainNodes",
  initialState: [],
  reducers: {
    addNode: (state, action) => {
      state.push(action.payload);
    },
    removeNode: (state, action) => {
      state.splice(action.payload, 1);
    },
    updateNode: (state, action) => {
      state[action.payload.index] = action.payload.node;
    },
  },
});

export const { addNode, removeNode, updateNode } = mainNodesSlice.actions;

export const selectMainNodes = (state) => state.mainNodes;

export default mainNodesSlice.reducer;
