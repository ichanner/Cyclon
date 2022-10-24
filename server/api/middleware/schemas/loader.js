import {sendUpdate} from "./groups.js";

export default(method)=>{

	switch(method){

		case "sendUpdate":

			return sendUpdate;

			break;

		default:

			return null;

			break;
	}
}