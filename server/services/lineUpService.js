import LineUpModel from "../schemas/lineUp.js";
import GroupService from "../services/groupService.js";

class LineUpService{

	async updateList(userId, pos, lineUp){

		try{

			if(lineUp.length == 1){

				await GroupService.createSingular(userId, pos);
			}
			else if(lineUp[lineUp.length-1].groupId != userId){

				await GroupService.createNestedSingular(lineUp, userId, pos);
			}

			await LineUpModel.updateOne({userId: userId}, {groups: lineUp}, {upsert: true});
		}
		catch(e){

			throw new Error(e.message);
		}
	}

	getLineUp(index, lineUp){

		if(lineUp.length-1 >= index){

			return lineUp[index];
		}
		else{

			return {groupId: "", groupType: -1, pos: {latitude: NaN, longitude: NaN}};
		}
	}
}

export default new LineUpService();