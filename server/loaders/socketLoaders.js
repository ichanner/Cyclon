import {Server} from "socket.io";
import registerSocketListeners from "../socketHandlers/index.js";
import redis from "socket.io-redis";
import config from "../config.js";
import middleware from "../api/middleware/index.js";

export default async(server)=>{

	const io = new Server(server);

	//io.adapter(redis({host: config.api.hostname, port: 5000})); TODO!

	io.on('connection', (socket)=>{

		//socket.use(middleware.socketValidator);

		socket.on("error", (err)=>{

			console.error(err.message);
		});

		registerSocketListeners(socket, io);
	});

};