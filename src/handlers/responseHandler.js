const constants = require('./constants');

module.exports.success = (message, resultData) => {
    return {
        headers: constants.responseHeader,
        statusCode: 200,
        body: JSON.stringify({
            message: message,
            status: true,
            data: resultData
        })
    };
};
module.exports.error = (message, err) => {
    return {
        headers: constants.responseHeader,
        statusCode: 500,
        body: JSON.stringify({
            message: message,
            status: false,
            reason: err.message
        })
    };
};
