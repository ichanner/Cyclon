import workerpool from "workerpool";
import config from "../config.js";

class WorkerManager {

	constructor(){

		this.pool = workerpool.pool(config.workers.path, {min: config.workers.max});
	}

	async exec(name, parameters){

		try{

			await this.pool.exec(name, parameters);

		}
		catch(e){

			console.error(e.message);
		}
		finally{

		//	this.pool.terminate();
		}

	}

	terminate(){

		this.pool.terminate();
	}
}

export default new WorkerManager();

