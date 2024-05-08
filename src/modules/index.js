import { combineReducers } from "redux";
import calendarReducer from "./CalendarModule";
import commuteReducer from "./CommuteModule";
import announcesModule from './AnnounceModule';
import memberReducer from "./MemberModule";
import passwordReducer from "./PasswordReducer";

const rootReducer = combineReducers({
    memberReducer,
    calendarReducer,
    commuteReducer,
    announcesModule,
    passwordReducer
});

export default rootReducer;