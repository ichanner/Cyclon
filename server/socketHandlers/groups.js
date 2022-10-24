import GroupService from "../services/groups.js";
import LineUpService from "../services/lineUp.js";


export default(socket, io)=>{

	const groupView = async(payload, callback)=>{

		try{

			const groups_view = await GroupService.getView(payload.zoom, payload.bounds);

			callback({

				view: groups_view
			})

		}
		catch(e){

			throw new Error(e.message)
		}
	}

	const sendUpdate = async(payload, callback)=>{

		try{

			const lineUp = await GroupService.selectGroups(payload.userId, payload.pos);

			await LineUpService.updateList(payload.userId, payload.pos, lineUp[0].groups);

			callback({

				lineUp: lineUp
			})

		}
		catch(e){

			throw new Error(e.message)
		}
	}

	socket.on("group:groups_view", groupView);

	socket.on("group:send_update", sendUpdate);
}
