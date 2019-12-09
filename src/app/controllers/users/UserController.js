const { User } = require('../../models');
const link = require('../../helpers/rest/link');
const { validationResult } = require('express-validator');
const Token = require('../../helpers/jwt/Token');

class UserController {
    async index (request, response) {
        try {
            const users = await User.findAll();

            if (!users.length) {
                const hateoas = {
                    message: 'You have no registered users yet.', 
                    links: [
                        link('/users', 'store', 'POST', this._getParams())
                    ]
                };

                return response
                    .status(404)
                    .json(hateoas);
            }

            return response
                .status(200)
                .json(users);
        } catch (exception) {
            const error = 'There was an error finding all users. Please, try again.'

            return response
                .status(500)
                .json({ error });
        }
    }

    async show (request, response) {
        try {
            const userId = request.params.id;
            const user = await User.findOne({
                where: {
                    id: userId
                }, 
                attributes: {
                    exclude: ['password_hash']
                }
            });
            const href = `/users/${userId}`;

            if (!user) {
                const error = 'User does not exists.';

                return response
                    .status(404)
                    .json({ error });
            }
            
            const hateoas = {
                user, 
                links: [
                    link(href, 'self', 'GET'), 
                    link(href, 'update', 'PUT', this._getParams()), 
                    link(href, 'destroy', 'DELETE')
                ]
            };

            return response
                .status(200)
                .json(hateoas);
        } catch (exception) {
            const error = `An error occurred while fetching user id ${userId}. Please, try again.`;

            return response
                .status(500)
                .json({ error });
        }
    }
    
    async store (request, response) {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                return response
                    .status(400)
                    .json(errors.array());
            }

            const token = new Token();
            const user = await User.create(request.body);
            const userId = user.id;
            const href = `/users/${userId}`;
            const hateoas = { 
                user,
                links: [
                    link(href, 'show', 'GET'), 
                    link(href, 'update', 'PUT', this._getParams()), 
                    link(href, 'destroy', 'DELETE'), 
                ], 
                access_token: await token.generate(user) 
            };

            request.userId = userId;
            
            return response
                .location(href)
                .status(201)
                .json(hateoas);
        } catch (exception) {
            const error = 'An error occurred while storing the user. Please, try again.';

            return response
                .status(500)
                .json({ error });
        }
    }

    async update (request, response) {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                return response
                    .status(400)
                    .json(errors.array());
            }

            const userId = request.params.id;
            const user = await User.findByPk(userId);
            const href = `/users/${userId}`;

            if (!user) {
                const error = 'User does not exists.';
                
                return response
                    .status(404)
                    .json({ error });
            }

            for (let key in request.body) {
                user[key] = request.body[key];
            }

            const hateoas = {
                user, 
                links: [
                    link(href, 'show', 'GET'), 
                    link(href, 'self', 'PUT', this._getParams()), 
                    link(href, 'destroy', 'DELETE')
                ]
            };

            await user.save();

            return response
                .status(200)
                .json(hateoas);
        } catch (exception) {
            const error = `An error occurred while updating user id ${userId}. Please, try again.`;

            return response
                .status(500)
                .json({ error });
        }
    }

    async destroy (request, response) {
        try {
            const userId = request.params.id;
            const user = User.findByPk(userId);

            if (!user) {
                const error = 'User not exists';

                return response
                    .status(404)
                    .json({ error });
            }

            await User.destroy({
                where: {
                    id: userId
                }
            });

            return response
                .status(204)
                .json({});
        } catch (exception) {
            const error = `An error occurred while destroying user id ${userId}. Please, try again.`;
            
            return response
                .status(500)
                .json({ error });
        }
    }

    _getParams () {
        return {
            name: {
                type: 'string', 
                required: true
            }, 
            email: {
                type: 'string', 
                required: true
            }, 
            password: {
                type: 'string', 
                required: true
            }
        };
    }
}

module.exports = new UserController();
