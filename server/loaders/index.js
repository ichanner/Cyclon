import socketLoaders from "./socketLoaders.js";
import expressLoaders from "./expressLoaders.js";
import mongodbLoader from "./mongodbLoader.js";
import config from "../config.js";

export default async(app, server)=>{


	await expressLoaders(app);

	await socketLoaders(server);
	
	await mongodbLoader();
};