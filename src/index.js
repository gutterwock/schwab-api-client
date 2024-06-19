const axios = require("axios");
const readline = require("readline");
const fs = require("fs");
const url = require("url");

const rl = readline.createInterface(
	process.stdin,
	process.stdout
);

const { callbackUrl, clientId, clientSecret , oauthUrl, token } = require("../config");

const requestCodeUrl = async ({ callbackUrl, clientId }) => {
	try {
		const res =  await axios({
			method: "get",
			url: oauthUrl +  "/authorize?client_id=" + encodeURIComponent(clientId) + "&redirect_uri=" + encodeURIComponent(callbackUrl),
			maxRedirects: 0
		});
		return res.headers.location;
	} catch (err) {
		const { response: { headers: { location } = {}, status } } = err;
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
			oauthUrl + "/token",
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

const main = async (outputFile) => {
	let { tokenExpiration, refreshExpiration, accessToken, refreshToken } = token;

	if (accessToken) {
		if (Date.now() < tokenExpiration) {
			return;
		} else if (Date.now() < refreshExpiration) {
			const { data } = await requestToken({ clientId, clientSecret, grantType: "refresh_token", refreshToken });
			saveToken({ data: { ...data, refreshExpiration }, outputFile });
			return;
		}
	}
	const codeUrl = await requestCodeUrl({ callbackUrl, clientId });
	console.log("Code url: ", codeUrl);
	let authCode;

	const authedUrl = await new Promise(resolve => {
		rl.question("Enter authenticated url:", resolve);
	});
	({ query: { code } } = url.parse(authedUrl, true));
	authCode = decodeURIComponent(code);
	refreshExpiration = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
	const { data } = await requestToken({ clientId, clientSecret, authCode, callbackUrl, grantType: "authorization_code" });
	saveToken({ data: { ...data, refreshExpiration }, outputFile });
	return;
};

const outputFile = "./config/token.json";
main(outputFile)
	.then(() => {
		console.log(`Token saved to ${outputFile}`);
	})
	.finally(() => {
		rl.close();
	});
