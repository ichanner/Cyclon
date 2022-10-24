import {SET_LOADING, SET_CONN_STATUS, SET_ERROR} from "./app.types";

const initialState = {

	loaded: false,
	error: null,
	connected: false
}

const appReducer = (state = initialState, action) =>{


	switch(action.type){

		case SET_LOADING:

			return {

				...state,
				loaded: action.payload
			}

			break;

		case SET_CONN_STATUS:

			return {

				...state,
				connected: action.payload,
				error: action.payload == true ? state.error : "Connect to the internet"
			}

			break;	

		case SET_ERROR:


			return {

				...state,
				error: action.payload
			}

			break;
		
		default:

			return state;

			break;
	}
}

export default appReducer;