const { callbackUrl, clientId, clientSecret } = require("./config.json");
const token = require("./token.json");

const oauthUrl = "https://api.schwabapi.com/v1/oauth";

module.exports = {
  callbackUrl,
  clientId,
  clientSecret,
  oauthUrl,
  token
};
