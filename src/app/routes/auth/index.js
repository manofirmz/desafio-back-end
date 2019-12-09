const express = require('express');
const routes = express.Router();
const { check } = require('express-validator');

const Authorization = require('../../middlewares/Authorization');
const AuthController = require('../../controllers/auth/AuthController');

const validators = [
    check('email').isEmail().withMessage('Email is required and must be a valid e-mail. Eg: user@email.com'), 
    check('password').isString().notEmpty().withMessage('Password must be filled.')
];

routes
    .route('/')
    .post(validators, AuthController.signIn)
    .delete(Authorization, AuthController.signOut);

module.exports = routes;
