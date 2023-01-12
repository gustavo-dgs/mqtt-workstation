import { configureStore } from "@reduxjs/toolkit";

import mainNodesReducer from "../../redux/reducers/mainNodesSlice";

const store = configureStore({
  reducer: {
    mainNodes: mainNodesReducer,
  },
});

export default store;
