import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducers from "./rootReducer";
import wsMiddleware from "./middleware/socket.middleware";

var middlewares = [thunk, wsMiddleware];

export default createStore(reducers, applyMiddleware(...middlewares));