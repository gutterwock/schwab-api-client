const axios = require("axios");
const fs = require("fs");
const readline = require("readline");

const OAUTH_URL = "https://api.schwabapi.com/v1/oauth";

// TODO: convert to common callApi
const requestCodeUrl = async ({ callbackUrl, clientId }) => {
	try {
		const res =  await axios({
			method: "get",
			url: OAUTH_URL +  "/authorize?client_id=" + encodeURIComponent(clientId) + "&redirect_uri=" + encodeURIComponent(callbackUrl),
			maxRedirects: 0
		});
		return res.headers.location;
	} catch (err) {
		const { response: { headers: { location } = {}, status } = {} } = err;
		if (status === 302) {
			return location;
		} else {
			throw new Error(`Failed to get code url: ${err.message}`);
		}
	}
};

const requestToken = async ({ clientId, clientSecret, authCode, callbackUrl, grantType, refreshToken }) => {
	try {
		return await axios.post(
			OAUTH_URL + "/token",
			(new URLSearchParams({
				grant_type: grantType,
				code: authCode,
				refresh_token: refreshToken,
				redirect_uri: callbackUrl
			})).toString(),
			{
				headers: {
					Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}
		);
	} catch (err) {
		if (err.response) {
			throw new Error(`POST auth code call with status code: ${err.response.status} and data: ${JSON.stringify(err.response.data)}`);
		} else {
			throw err;
		}
	}
};

const loadConfigs = (configFile) => {
	return JSON.parse(fs.readFileSync(configFile));
};

const loadToken = (tokenFile) => {
	let token = {};
	try {
		token = JSON.parse(fs.readFileSync(tokenFile));
	} catch {
	} finally {
		return token;
	}
};

const saveToken = ({ data, outputFile }) => {
	const {
		expires_in: expiresIn,
		refreshExpiration,
		token_type: tokenType,
		refresh_token: refreshToken,
		access_token: accessToken
	} = data;
	const tokenExpiration = Date.now() + expiresIn * 1000;
	fs.writeFileSync(outputFile, JSON.stringify({
		tokenExpiration,
		refreshExpiration,
		tokenType,
		refreshToken,
		accessToken
	}, null, 2));
};

const createReadline = () => {
	return readline.createInterface(
		process.stdin,
		process.stdout
	);
};

module.exports = {
	createReadline,
	loadConfigs,
	loadToken,
	requestCodeUrl,
	requestToken,
	saveToken
};
