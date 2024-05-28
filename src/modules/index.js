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
import surveyReducer from "./SurveyModule";
import insiteReducer from "./InsiteModule";
import noticeReducer from "./NoticeModule";


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
    approval: approvalReducer,
    surveyReducer,
    insiteReducer,
    noticeReducer
});

export default rootReducer;