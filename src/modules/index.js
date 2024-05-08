import { combineReducers } from "redux";
import calendarReducer from "./CalendarModule";

const rootReducer = combineReducers({
    calendarReducer
});

export default rootReducer;