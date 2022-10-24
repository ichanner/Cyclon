import {APP_NOT_LOADED} from "../../utils/constants/location.constants";
import {SET_LOCATION, SET_LOCATION_PERMISSION, SET_GROUP_VIEW, SET_LOCATION_ERROR} from "./discover.types";

const initialState = {

	location: {timestamp: null, accuracy: null, latitude: null, longitude: null},
	location_permission: APP_NOT_LOADED,
	group_view:[],
	location_error: null
}

const discoverReducer = (state = initialState, action) =>{

	switch(action.type){

		case SET_GROUP_VIEW:

			return {

				...state,
				group_view: action.payload
			}

			break;


		case SET_LOCATION_PERMISSION:

			return{

				...state,
				location_permission: action.payload 
			};


			break;


		case SET_LOCATION:

			return{

				...state,
				location: action.payload
			};

			break;

		case SET_LOCATION_ERROR:

			return{

				...state,
				error: action.payload
			}

			break;

		default:

			return state;

			break;
	}
}

export default discoverReducer;