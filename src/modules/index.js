import { combineReducers } from "redux";
import calendarReducer from "./CalendarModule";
import commuteReducer from "./CommuteModule";
import announceReducer from './AnnounceModule';
import memberReducer from "./MemberModule";
import passwordReducer from "./PasswordReducer";
import noteReducer from "./NoteMudule";
import leaveReducer from "./LeaveModule";
import {chattingReducer, roomReducer} from "./CahttingModules";
import approvalReducer from "./ApprovalReducer";


const rootReducer = combineReducers({
    memberReducer,
    calendarReducer,
    commuteReducer,
    announceReducer,
    passwordReducer,
    noteReducer,
    leaveReducer,
    chattingReducer,
    roomReducer,
    approval: approvalReducer
});

export default rootReducer;