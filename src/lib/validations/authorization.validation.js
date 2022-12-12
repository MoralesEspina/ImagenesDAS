const { body } = require('express-validator');

const authorizationValidator = [
    body("width").isNumeric().not().isEmpty().trim().escape(),
    body("height").isNumeric().not().isEmpty().trim().escape(),
    body("align").not().isEmpty().trim().escape(),
]

module.exports = {
    authorizationValidator
}