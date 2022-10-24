var express = require("express");

async function startServer(){

	const app = express();

	const port = 5000;

	app.listen(port, ()=>{

		console.log("Server running on port " + port);

	}).on("error", err=>{

		console.error(err);
	})

}


startServer();