const { callbackUrl, key, secret } = require("./config.json");

const oauthUrl = "https://api.schwabapi.com/v1/oauth";

module.exports = {
  callbackUrl,
  key,
  oauthUrl,
  secret
};