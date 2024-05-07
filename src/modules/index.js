import { combineReducers } from 'redux';
import announcesModule from './AnnounceModule';

const rootReducer = combineReducers({
    announcesModule,
});

export default rootReducer;