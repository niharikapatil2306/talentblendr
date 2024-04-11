import { combineReducers } from "redux";
import userReducer from "./reducer";

const rootReducer = combineReducers({
    userReducer: userReducer,
})

export default rootReducer;