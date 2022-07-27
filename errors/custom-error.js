class CustomAPIError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}

const createCustomeError = (message, statusCode) => {
    return new CustomAPIError(message, statusCode);
}

module.exports = {
    createCustomeError,
    CustomAPIError
}