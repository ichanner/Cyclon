import {Router} from "express";
import middleware from "../middleware/index.js";
import GroupController from "../../controllers/groups.js"

var router = new Router();

export default(app)=>{
	
	app.use("/groups", router);

	//router.post("/sendUpdate", [middleware.validateGroup("sendUpdate"), middleware.validate()], GroupController.sendUpdate());
}

