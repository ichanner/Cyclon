import {SET_LOADING, SET_CONN_STATUS, SET_ERROR} from "./app.types";

export const setLoading = (loaded) => {

	return (dispatch)=>{

		dispatch({type: SET_LOADING, payload: loaded});
	}
}

export const setError = (err) =>{

	return {type: SET_ERROR, payload: err};
}

export const setError_DISPATCH = (err) =>{

	return (dispatch)=>{

		dispatch({type: SET_ERROR, payload: err});
	}
}

export const setConnectionStatus = (connected) => {

	return (dispatch)=>{

		dispatch({type: SET_CONN_STATUS, payload: connected});
	}
}