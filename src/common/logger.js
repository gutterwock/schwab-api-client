const logError = ({ error, message }) => {
	console.error(message || error.message);
};

const logInfo = ({ message }) => {
	console.log(message);
}

module.exports = {
	logError,
	logInfo
};
