import mongoose from "mongoose";
import config from "../config.js";

export default async() =>{

	try{

		const group_conn = await mongoose.connect(config.db.group_db_uri, config.db.options);

		return {group_conn};
	}
	catch(e){

		console.error(e.message);

		throw new Error(e);
	}
}