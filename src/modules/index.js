import { combineReducers } from "redux";
import calendarReducer from "./CalendarModule";
import commuteReducer from "./CommuteModule";
import announceReducer from './AnnounceModule';
import memberReducer from "./MemberModule";
import passwordReducer from "./PasswordReducer";

const rootReducer = combineReducers({
    memberReducer,
    calendarReducer,
    commuteReducer,
    announceReducer,
    passwordReducer
});

export default rootReducer;