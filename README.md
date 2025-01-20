# Schwab Auth

NodeJS implementation of Schwab OAuth flow as detailed [here](https://developer.schwab.com/user-guides/get-started/authenticate-with-oauth).

Generates a `token.json` with access and refresh tokens for use with Schwab APIs.


# Instructions
	1. Get your app approved [here](https://developer.schwab.com/user-guides/get-started/requesting-product-access)

	2. In your config folder, add a `config.json` with the `callbackUrl`, `clientId`, and `clientSecret` for your app

	3. Run `npm install`

	4. Run `node src/index.js` with optional environment variable `CONFIG_DIR` to specify a custom config folder (defaults to `./config`)

	5. Go to the url that is output and authenicate/accept terms until you reach a blank page

	6. Copy the url of the blank page into console and proceed

	7. Use the generating `token.json` to call Schwab APIs
