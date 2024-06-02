const axios = require("axios");
const readline = require("readline").createInterface(
	process.stdin,
	process.stdout
);
const fs = require("fs");
const querystring = require("querystring");
const url = require("url");

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

const requestToken = async ({ clientId, clientSecret, authCode, callbackUrl }) => {
	try {
		return await axios.post(
			oauthUrl + "/token",
			querystring.stringify({
				grant_type: "authorization_code",
				code: authCode,
				redirect_uri: callbackUrl
			}),
			{
				headers: {
					Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}
		);
	} catch (err) {
		throw new Error(`POST auth code call with status code: ${err.response.status} and data: ${JSON.stringify(err.response.data)}`);
	}
};

const main = async (outputFile) => {
	let { tokenExpiration, refreshExpiration, tokenType, accessToken, refreshToken } = token;

	if (accessToken) {
		if (Date.now() < tokenExpiration) {
			return tokenType + " " + accessToken;
		} else if (Date.now() < refreshExpiration) {
			// TODO
			// request refresh
			// write new token and expiration
			return;
		}
	}
	const codeUrl = await requestCodeUrl({ callbackUrl, clientId });
	console.log("Code url: ", codeUrl);
	let authCode;
	readline.question("Enter authenticated url:", async (authedUrl) => {
		({ query: { code } } = url.parse(authedUrl, true));
		authCode = decodeURIComponent(code);
		refreshExpiration = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
		({
			data: {
				expires_in: expiresIn,
				token_type: tokenType,
				refresh_token: refreshToken,
				access_token: accessToken
			}
		} = await requestToken({ clientId, clientSecret, authCode, callbackUrl }));

		tokenExpiration = Date.now() + expiresIn * 1000;
		fs.writeFileSync(outputFile, JSON.stringify({
			tokenExpiration,
			refreshExpiration,
			refreshToken,
			accessToken
		}, null, 2));

		return tokenType + " " + token;
	});
};

main("./config/token.json").then((res) => {
	// console.log(res);
}).finally(() => {
	// readline.close();
})
