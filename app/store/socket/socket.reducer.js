import {CONNECT_WS, DISCONNECT_WS, CONN_ERR} from "./socket.types";
import {CONN_DELAY} from "../../utils/constants/socket.constants";

initialState = {

	connected: false,
	timeout_offset: CONN_DELAY
}

const socketReducer = (state=initialState, action) =>{


	switch(action.type){


		case CONNECT_WS:


			return {

				...state,
				connected: true
			}

			break;

		case CONN_ERR:

			return {	

				...state,
				connected: false,
				timeout_offset: (state.timeout_offset + CONN_DELAY)
			}

			break;

		default:

			return state;

			break;
	}
}

export default socketReducer;