const { User } = require('../../models');
const { validationResult } = require('express-validator');
const Token = require('../../helpers/jwt/Token');

class AuthController {
    async signIn (request, response) {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                return response
                    .status(400)
                    .json(errors.array());
            }

            const { email, password } = request.body;
            const user = await User.findOne({
                where: {
                    email
                }
            });
    
            if (!user) {
                return response
                    .status(401)
                    .json({ error: 'User does not exists.' });
            }
    
            if (!(await user.checkPassword(password))) {
                return response
                    .status(401)
                    .json({ error: 'Invalid password.' })
            }
            
            const token = new Token();

            return response
                .status(200)
                .json({
                    user, 
                    access_token: await token.generate(user)
                });
        } catch (error) {
            return response
                .status(500)
                .json({ error: error.message });
        }
    }

    async signOut (request, response) {
        try {
            const [, token] = request.headers.authorization.split(' ');
            const tokenJwt = new Token();

            await tokenJwt.revoke(token);
            
            return response
                .status(200)
                .json({});
        } catch (error) {
            return response
                .status(500)
                .json({ error: error.message });
        }
    }
}

module.exports = new AuthController();
