import { combineReducers } from "redux";
import discoverReducer from "./discover/discover.reducer";
import appReducer from "./app/app.reducer";
import socketReducer from "./socket/socket.reducer";

const reducers = combineReducers({app: appReducer, socket: socketReducer, discover: discoverReducer});


export default reducers;