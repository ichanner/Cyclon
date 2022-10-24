import {CONNECT_WS, DISCONNECT_WS, CONN_ERR} from "./socket.types";

export const connectWS = (host) =>{


	return {type: CONNECT_WS, payload: host};
}

export const connectionError = () =>{

	return {type: CONN_ERR};
}

export const disconnectWS = () =>{


	return {type: DISCONNECT_WS};
}