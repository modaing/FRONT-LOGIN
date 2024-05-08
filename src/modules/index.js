import { combineReducers } from "redux";
import commuteReducer from "./CommuteModule";
import announcesModule from './AnnounceModule';

const rootReducer = combineReducers({
    commuteReducer,
    announcesModule
});

export default rootReducer;