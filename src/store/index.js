import { configureStore } from "@reduxjs/toolkit";

import mainNodesReducer from "./mainNodesSlice";

const store = configureStore({
  reducer: {
    mainNodes: mainNodesReducer,
  },
});

export default store;
