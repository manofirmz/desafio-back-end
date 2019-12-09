const Token = require('../helpers/jwt/Token');

module.exports = async (request, response, next) => {
    if (!('authorization' in request.headers)) {
        return response
            .status(401)
            .json({ error: 'Authorization header is required.' });
    }

    const [bearer, token] = request.headers.authorization.split(' ');
    const bearerTokenFound = bearer && /^bearer$/i.test(bearer);

    if (!bearerTokenFound) {
        const error = 'Invalid format for authorization header. Try: Bearer {access_token}';
        
        return response
            .status(401)
            .json({ error });
    }

    try {
        const tokenJwt = new Token();
        const decoded = await tokenJwt.isValid(token);

        if (await tokenJwt.isBlacklisted(decoded)) {
            return response
                .status(401)
                .json({ error: 'Invalid token.' });
        }

        request.userId = decoded.id;

        return next();
    } catch (error) {
        return response
            .status(401)
            .json({ error: error.message });
    }
};
