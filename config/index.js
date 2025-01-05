const { callbackUrl, clientId, clientSecret } = require("./config.json");
let token
try {
	token = require("./token.json");
} catch {
	token = {};
}

const oauthUrl = "https://api.schwabapi.com/v1/oauth";

module.exports = {
	callbackUrl,
	clientId,
	clientSecret,
	oauthUrl,
	token
};
