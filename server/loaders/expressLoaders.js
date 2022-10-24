import cors from "cors";
import config from "../config.js";
import routes from "../api/index.js";
import expressValidator from "express-validator";
import express from "express";

export default async(app)=>{


	app.enable("trust proxy");

	app.use(cors());
	app.use(express.json());

	app.use(config.app.api_prefix, routes());

	app.get("/status", (req, res)=>{

		res.status(200).end();
	})

	app.head("/status", (req, res)=>{

		res.status(200).end();
	});

	app.use((err, req, res, next)=>{

		var err = new Error("Not Found!");

		err.status = 404;

		next(err);
	});

	app.use((err, req, res, next)=>{

		res.status(err.status || 500);

		res.json({

			error: err.message || "Server Error!"
		
		}).end();
	});

};