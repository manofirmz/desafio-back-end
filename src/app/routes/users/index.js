const express = require('express');
const routes = express.Router();
const { check } = require('express-validator');

const UserController = require('../../controllers/users/UserController');

const validators = [
    check('name').isString().notEmpty().withMessage('Name is required and must be string.'), 
    check('email').isEmail().notEmpty().withMessage('Email is required and must be a valid e-mail. Eg: user@email.com'), 
    check('password').isAlphanumeric().withMessage('Password is required and must be alphanumeric. Eg: a15#*kojj')
];

routes.get('/', (request, response) => 
    UserController.index(request, response));
routes.post('/', validators, (request, response) => 
    UserController.store(request, response));

routes
    .route('/:id')
    .get((request, response) => 
        UserController.show(request, response))
    .put(validators, (request, response) => 
        UserController.update(request, response))
    .delete((request, response) => 
        UserController.destroy(request, response));
    
module.exports = routes;
