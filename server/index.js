import express from "express";
import {createServer} from "http";
import config from "./config.js";
import loaders from "./loaders/index.js";


async function startServer(){

	const app = express();
	const server = createServer(app);

	await loaders(app, server)

	server.listen(config.app.port || 5000, ()=>{
		
		console.log("Server Started");
	
	})
}	

startServer();	
