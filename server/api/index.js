import groups from "./routes/groups.js";
import {Router} from "express";

export default()=>{

	const app = new Router();

	groups(app)

	return app;
}