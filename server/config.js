import dotenv from "dotenv";

const env = dotenv.config();

if(env.error){

	throw new Error("ERROR: ENV file not found!");
}

export default{


		app:{

			api_prefix: "/api",
			port: process.env.PORT,
			hostname: process.env.DOMAIN
		},

		workers: {

			path: process.env.WORKER_PATH,
			min: "max"
		},

		db:{

			group_db_uri: process.env.GROUP_DB_URI,

			options:{

				useNewUrlParser: true,
				useUnifiedTopology: true
			}
		},

		redis:{} //TODO

	
}