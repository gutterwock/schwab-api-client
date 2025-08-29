const axios = require("axios");
const { logError } = require("./logger");

const BASE_URL = "https://api.schwabapi.com";

const callApi = async ({
	data,
	name,
	method = "get",
	path,
	token,
	urlQueryParams
}) => {
	try {
		const queryStr = urlQueryParams && Object.keys(urlQueryParams)
			.filter((key) => urlQueryParams[key])
			.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(urlQueryParams[key])}`)
			.join("&");
		const url = BASE_URL + path + (queryStr ? "?" + queryStr : "");
		return await axios({
			method,
			url,
			data,
			headers: {
				authorization: `Bearer ${token}`
			}
		});
	} catch (error) {
		logError({ error, message: `Failed to ${method} ${name || path}:` + error.message });
		throw error;
	}
};

module.exports = callApi;
