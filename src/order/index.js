const callApi = require("../common/callApi");

const getOrders = ({ accountNumber, from, status, to, token }) => {
	return callApi({
		method: "get",
		path: "/trader/v1/" + (accountNumber ? `accounts/${accountNumber}/orders` : "orders"),
		token,
		urlQueryParams: {
			fromEnteredTime: from,
			toEnteredTime: to,
			status
		}
	});
};

const cancelOrder = ({ accountNumber, orderId, token }) => {
	return callApi({
		method: "delete",
		path: `/trader/v1/accounts/${accountNumber}/orders/${orderId}`,
		token,
	});
};

const createOrder = ({ accountNumber, orderData, token }) => {
	return callApi({
		method: "post",
		data: orderData,
		path: `/trader/v1/accounts/${accountNumber}/orders`,
		token,
	});
};

module.exports = {
	cancelOrder,
	createOrder,
	getOrders,
};
