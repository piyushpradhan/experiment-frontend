import { combineReducers } from "@reduxjs/toolkit";
import tab from "./activeTab";
import channel from "./channel";
import message from "./message";
import user from "./user";

const rootReducer = combineReducers({
  tab,
  channel,
  message,
  user
});

export default rootReducer;
