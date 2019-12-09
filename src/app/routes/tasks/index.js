const express = require('express');
const routes = express.Router();
const { check } = require('express-validator');

const Authorization = require('../../middlewares/Authorization');
const ShowOwnTasks = require('../../middlewares/ShowOwnTasks');
const TaskController = require('../../controllers/tasks/TaskController');

const validators = [
    check('name').isString().notEmpty().withMessage('Name is required and must be string.'), 
    check('description').isString().notEmpty().withMessage('Description is required and must be string.'), 
    check('user_id').isNumeric().withMessage('User id is required and must be number.'), 
    check('completion_status').isBoolean().optional().withMessage('Completion status is optional, but must be boolean.'), 
    check('cancellation_status').isBoolean().optional().withMessage('Cancellation status is optional, but must be boolean.')
];

routes.use(Authorization);

routes.get('/', (request, response) => 
    TaskController.index(request, response));
routes.post('/', validators, (request, response) => 
    TaskController.store(request, response));

routes
    .route('/:id')
    .get(ShowOwnTasks, (request, response) => 
        TaskController.show(request, response))
    .put(ShowOwnTasks, validators, (request, response) => 
        TaskController.update(request, response))
    .delete(ShowOwnTasks, TaskController.destroy);

module.exports = routes;
