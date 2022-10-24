import {SET_LOCATION, SET_LOCATION_PERMISSION, GET_GROUP_VIEW, SEND_UPDATE, SET_GROUP_VIEW, SET_LOCATION_ERROR} from "./discover.types";
//import GroupService from "../../services/groups";

export const setGroupView = (groups) =>{

	return {type: SET_GROUP_VIEW, payload: groups};
}

//Connected dispatches

export const sendUpdate = (location) =>{

	return (dispatch)=>{

		dispatch({type: SEND_UPDATE, payload: location});	
	}
}

export const getGroupView = (bounds, zoomLevel) =>{

//	GroupService.getView(bounds, zoomLevel);

	return (dispatch)=>{

		dispatch({type: GET_GROUP_VIEW, payload: {bounds: bounds, zoomLevel: zoomLevel}});	
	}
}

export const setLocation = (location) =>{

	return (dispatch) =>{

		dispatch({type: SET_LOCATION, payload: location})
	}
}

export const setLocationPermission = (permission) =>{

	return (dispatch)=>{

		dispatch({type: SET_LOCATION_PERMISSION, payload: permission});
	}
}

export const setLocationError = (err) => {

	return (dispatch)=>{

		dispatch({type: SET_LOCATION_ERROR, payload: err});
	}
}