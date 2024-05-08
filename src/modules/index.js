import { combineReducers } from "redux";
import commuteReducer from "./CommuteModule";
import announcesModule from './AnnounceModule';
import memberReducer from "./MemberModule";
import passwordReducer from "./PasswordReducer";

const rootReducer = combineReducers({
    memberReducer,
    commuteReducer,
    announcesModule,
    passwordReducer
});

export default rootReducer;