const url = require("url");
const {
	createReadline,
	loadConfigs,
	loadToken,
	requestCodeUrl,
	requestToken,
	saveToken
} = require("./authHelper");

const configFile = process.env.CONFIG_FILE || "./config/config.json";
const outputFile = process.env.OUTPUT_FILE || "./config/token.json";

const main = async () => {
	let readline;
	try {
		readline = createReadline();
		const { callbackUrl, clientId, clientSecret } = loadConfigs(configFile);
		let { tokenExpiration, refreshExpiration, accessToken, refreshToken } = loadToken(outputFile);

		if (accessToken) {
			if (Date.now() < tokenExpiration) {
				console.log("Access token is still valid.")
				return;
			} else if (Date.now() < refreshExpiration) {
				console.log("Access token has expired. Refreshing.")
				const { data: refreshData } = await requestToken({ clientId, clientSecret, grantType: "refresh_token", refreshToken });
				saveToken({ data: { ...refreshData, refreshExpiration }, outputFile });
				return;
			} else {
				console.log("Refresh token has expired. Requesting a new one.");
			}
		}

		const codeUrl = await requestCodeUrl({ callbackUrl, clientId });
		console.log("Code url: ", codeUrl);
		let authCode;
		const authedUrl = await new Promise(resolve => {
			readline.question("Enter authenticated url:", resolve);
		});
		({ query: { code } } = url.parse(authedUrl, true));
		authCode = decodeURIComponent(code);
		refreshExpiration = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
		const { data: tokenData } = await requestToken({ clientId, clientSecret, authCode, callbackUrl, grantType: "authorization_code" });
		saveToken({ data: { ...tokenData, refreshExpiration }, outputFile });
		return;
	} catch (err) {
		console.error(`Failed to auth: ${err.message}`);
	} finally {
		readline?.close();
	}
};

main();
