/**
 * respond
 * @param {http.response} res http response
 * @param {number} statusCode status code in response 
 * @param {Object} response { Ok: boolean, message: string, data: any }
 */
const respond = (res, statusCode, response) => {
    if (!response) {
        respondError(res);
    }
    
    res.status(statusCode).json(response)
}

/**
 * Respond Internal server error
 * @param {http.response} res http response
 * @param {Error} error error
 */
const respondError = (res, error) => {
    console.log(error)
    res.status(500).json('Internal Server Error');
}

module.exports = {
    respond,
    respondError
}