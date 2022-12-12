const fs = require('fs')
const jwt = require('jsonwebtoken');
const { respond } = require('../handlers/response');
const PUBLIC_KEY = fs.readFileSync('src/certificates/public.rsa.pub', 'utf-8')

const Auth = {}

Auth.Login = async (req, res, next) => {
    
    try {
        if (!req.headers.authorization) {
            respond(res, 401, { ok: false, message: 'Unauthorized', data: [] });
            return;
        }

        if (!req.headers.authorization.split(' ').includes('Bearer')) {
            return respond(res, 400, { ok: false, message: 'The parameter in the header is not valid', data: [] });
        }

        var token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return respond(res, 401, { ok: false, message: 'Unauthorized, token not found in the request', data: [] });
        }

        var payload = jwt.verify(token, PUBLIC_KEY)
        req.user = payload.user

        next()
    } catch (error) {
        let result = JSON.parse(JSON.stringify(error))
        if (result.name == 'TokenExpiredError') {
            return respond(res, 401, { ok: false, message: 'Token was expired', data: [] });
        }
        
        return respond(res, 401, { ok: false, message: 'The token is invalid', data: [] });
    }
}

module.exports = Auth;