const axios = require("axios");

const { callbackUrl, key, oauthUrl, secret } = require("../config");

const requestCode = async ({ callbackUrl, key }) => {
	try {
		const url = oauthUrl +  "/authorize?client_id=" + encodeURIComponent(key) + "&redirect_uri=" + encodeURIComponent(callbackUrl);
		console.log(url);
		return await axios.get(url);
	} catch (err) {
		console.log(err.response.data);
	}
};

const main = async () => {
	const { data } = await requestCode({ callbackUrl, key });
	console.log(data);
};

main();