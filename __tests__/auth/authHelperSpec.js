const axios = require("axios");
const authHelper = require("../../src/auth/authHelper");

jest.mock("axios");

beforeAll(() => jest.resetAllMocks());
afterEach(() => jest.resetAllMocks());

describe("authHelper", () => {
	xdescribe("requestCodeUrl", () => {
		const callbackUrl = "a";
		const clientId = "b";
		const location = "c"

		it("makes a call to request a code url", async () => {
			axios.mockResolvedValue({ headers: { location } });
			await authHelper.requestCodeUrl({ callbackUrl, clientId });

			expect(axios).toHaveBeenCalledWith({
				maxRedirects: 0,
				method: "get",
				url: expect.stringMatching(`client_id=${clientId}&redirect_uri=${callbackUrl}`),
			});
		});

		it("handles errors", async () => {
			axios.mockRejectedValue({});

			expect(authHelper.requestCodeUrl({ callbackUrl, clientId }))
				.rejects.toThrow("Failed to get code url: undefined");
		});
	});

	describe("requestToken", () => {
		const params = {
			authCode: "a",
			callbackUrl: "b",
			clientId: "c",
			clientSecret: "d",
			grantType: "e",
			refreshToken: "f",
		};

		it("makes a call to request a token", async () => {
			axios.mockResolvedValue({});
			await authHelper.requestToken(params);

			expect(axios).toHaveBeenCalledWith({
				method: "post",
				url: expect.stringMatching(`grant_type=${params.grantType}&code=${params.authCode}&refresh_token=${params.refreshToken}&redirect_uri=${params.callbackUrl}`),
				headers: {
					Authorization: expect.any(String),
					"Content-Type": expect.any(String),
				},
			});
		});
	});
});
