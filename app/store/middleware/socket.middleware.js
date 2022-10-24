import {GET_GROUP_VIEW, SET_GROUP_VIEW, SEND_UPDATE} from "../discover/discover.types";
import {CONNECT_WS, DISCONNECT_WS} from "../socket/socket.types";
import {GROUP_VIEW_EVENT, UPDATE_EVENT} from "../../utils/constants/socket.constants";
import {io} from "socket.io-client";
import {connectWS, disconnectWS, connectionError} from "../socket/socket.actions";
import {setGroupView} from "../discover/discover.actions";
import {setError} from "../app/app.actions";


var socket;

const onConnect = (store, host)=>{

	store.dispatch(connectWS(host))
}

const onDisconnect = (store, host)=>{

	return(reason)=>{

		store.dispatch(disconnectWS())

		if(reason == "server namespace disconnect"){

			socket.connect(host)
		}
	}
}

const onError = (store, host) =>{

	store.dispatch(setError("Unable To Connect"));
	
	store.dispatch(connectionError());

	setTimeout(()=>{

		socket.connect(host)

	}, store.getState().socket.timeout_offset);
	
}

const onEvent = (store) =>{

	return (event, data)=>{

		switch(event){

			case GROUP_VIEW_EVENT:

				store.dispatch(setGroupView(data.groups));

				break;
			
			default:

				break;
		}
	}
	
}

const wsMiddleware = store => next => action =>{

		switch(action.type){

			case CONNECT_WS:

				if(socket != null){

					socket.disconnect();
				}

				socket = io(action.payload, {

					transports:["websocket", "polling"]

				});

				console.log("ss")
				
				//socket.on("connect", onConnect(store, action.payload));
				
				socket.on("disconnect", onDisconnect.bind(store, action.payload));
				socket.on("connect_failed", onError.bind(store, action.payload));
				socket.onAny(onEvent.bind(store));

				break;	

			case DISCONNECT_WS:

				if(socket != null){

					socket.disconnect();
				}

				socket = null;

				break;

			case GET_GROUP_VIEW:

				if(socket != null){

					socket.emit(GROUP_VIEW_EVENT, action.payload);
				}
				
				break;

			case SEND_UPDATE:

				if(socket != null){

					socket.emit(UPDATE_EVENT, action.payload);
				}

				break;

			default:

				return next(action);

				break;
		}
}

export default wsMiddleware;
