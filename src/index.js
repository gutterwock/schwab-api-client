const url = require("url");
const {
	createReadline,
	loadConfigs,
	loadToken,
	requestCodeUrl,
	requestToken,
	saveToken
} = require("./auth/authHelper");

const account = require("./account");
const market = require("./market");
const order = require("./order");

class SchwabApiClient {
	constructor({ configFile, tokenFile }) {
		this.configFile = configFile;
		this.tokenFile = tokenFile;
		this.tokenType;
		this.accessToken;
		this.refreshToken;
		this.tokenExpiration;
		this.refreshExpiration;
	};

	setToken(tokenData) {
		this.tokenType = tokenData.tokenType;
		this.accessToken = tokenData.accessToken;
		this.refreshToken = tokenData.refreshToken;
		this.tokenExpiration = tokenData.tokenExpiration;
		this.refreshExpiration = tokenData.refreshExpiration;
	};

	// TODO: can just set the token at the callApi level instead, and use preconfigured axiosClient
	useInstanceToken() {
		this.account = this.useToken(account);
		this.market = this.useToken(market);
		this.order = this.useToken(order);
	};

	useToken(api) {
		const result = {};
		for (const key in api) {
      if (typeof api[key] === "function") {
        result[key] = (args) => {
          return api[key]({ token: this.accessToken, ...(args || {}) });
        };
      }
		}
		return result;
	};

	async authenticate() {
		let readline;
		try {
			readline = createReadline();
			const { callbackUrl, clientId, clientSecret } = loadConfigs(this.configFile);
			let { tokenType, tokenExpiration, refreshExpiration, accessToken, refreshToken } = loadToken(this.tokenFile);

			if (accessToken) {
				if (Date.now() < tokenExpiration) {
					console.log("Access token is still valid.")
					this.setToken({ tokenType, tokenExpiration, refreshExpiration, accessToken, refreshToken });
					return;
				} else if (Date.now() < refreshExpiration) {
					console.log("Access token has expired. Refreshing.")
					const { data: refreshData } = await requestToken({ clientId, clientSecret, grantType: "refresh_token", refreshToken });
					saveToken({ data: { ...refreshData, refreshExpiration }, outputFile: this.tokenFile });
					this.setToken({ ...refreshData, refreshExpiration });
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
			const { query: { code } } = url.parse(authedUrl, true);
			authCode = decodeURIComponent(code);
			refreshExpiration = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
			const { data: tokenData } = await requestToken({ clientId, clientSecret, authCode, callbackUrl, grantType: "authorization_code" });
			saveToken({ data: { ...tokenData, refreshExpiration }, outputFile: this.tokenFile });
			this.setToken({ ...tokenData, refreshExpiration });

			return;
		} catch (err) {
			console.error(`Failed to auth: ${err.message}\n${err.stack}`);
		} finally {
			readline?.close();
		};
	}
};

module.exports = SchwabApiClient;
