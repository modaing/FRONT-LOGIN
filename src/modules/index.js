import { combineReducers } from "redux";
import calendarReducer from "./CalendarModule";
import commuteReducer from "./CommuteModule";
import announcesModule from './AnnounceModule';

const rootReducer = combineReducers({
    calendarReducer,
    commuteReducer,
    announcesModule
});

export default rootReducer;