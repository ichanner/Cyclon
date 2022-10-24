
import axios from "axios";

const instance = axios.create({

	baseUrl: config.server.domain_api,
	timeout: 1000,
	maxContentLength: 2000,
	maxBodyLength: 2000,
	headers:{'Content-Type': 'application/json'}

})

export default instance;