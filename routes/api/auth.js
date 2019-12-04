const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const express = require('express');
const router = express.Router();

const jwtAuth = jwt({
    // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: process.env.AUTH0_CLIENT_ID,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
});

/* GET home page. */
router.get('/ping', jwtAuth, function(req, res, next) {
    res.send({
        payload: "pong"
    })
});

module.exports = router;
