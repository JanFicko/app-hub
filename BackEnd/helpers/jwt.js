const expressJwt = require('express-jwt');
const config = require('../config');

module.exports = jwt;

function jwt() {
    return expressJwt({ secret: config.JWT_SECRET }).unless({
        path: [
            // public routes that don't require authentication
            '/api/users/login'
        ]
    });
}