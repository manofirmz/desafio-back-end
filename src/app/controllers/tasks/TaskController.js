const { Task } = require('../../models');
const link = require('../../helpers/rest/link');
const { validationResult } = require('express-validator');

class TaskController {
    async index (request, response) {
        try {
            const tasks = await Task.findAll({
                where: {
                    user_id: request.userId
                }
            });
    
            if (!tasks) {
                const hateoas = {
                    message: 'You have no registered tasks yet.', 
                    links: [
                        link('/tasks', 'store', 'POST', this._getParams())
                    ]
                };
    
                return response
                    .status(204)
                    .json(hateoas);
            }
    
            return response
                .status(200)
                .json(tasks);
        } catch (exception) {
            const error = 'There was an error finding all your tasks. Please, try again.';
            
            return response
                .status(500)
                .json({ error });
        }
    }

    async show (request, response) {
        try {
            const taskId = request.params.id;
            const task = request.task;
            const href = `/tasks/${taskId}`;
            const hateoas = {
                task, 
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
            const error = `An error occurred while fetching task id ${taskId}. Please, try again.`;
            
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

            const payload = {
                ...request.body, 
                user_id: request.userId
            };
            const stored = await Task.create(payload);
            const taskId = stored.id;
            const href = `/tasks/${taskId}`;
            const hateoas = {
                task: stored, 
                links: [
                    link(href, 'show', 'GET'), 
                    link(href, 'update', 'PUT', this._getParams()), 
                    link(href, 'destroy', 'DELETE')
                ]
            };

            return response
                .location(href)
                .status(201)
                .json(hateoas);
        } catch (exception) {
            const error = 'An error occurred while storing your task. Please, try again.';

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
            
            const taskId = request.params.id;
            const task = request.task;
            const href = `/tasks/${taskId}`;
            
            for (let key in request.body) {
                task[key] = request.body[key];
            }
   
            const hateoas = {
                task, 
                links: [
                    link(href, 'show', 'GET'), 
                    link(href, 'self', 'PUT', this._getParams()), 
                    link(href, 'destroy', 'DELETE')
                ]   
            };

            await task.save();

            return response
                .status(200)
                .json(hateoas);
        } catch (exception) {
            const error = `An error occurred while updating task id ${taskId}. Please, try again.`;
            return response
                .status(500)
                .json({ error });
        }
    }

    async destroy (request, response) {
        try {
            const taskId = request.params.id;
            await Task.destroy({
                where: {
                    id: taskId
                }
            });

            return response
                .status(204)
                .json({});
        } catch (exception) {
            const error = `An error occurred while destroying task id ${taskId}. Please, try again.`;

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
            description: {
                type: 'string', 
                required: true
            }, 
            completion_status: {
                type: 'boolean', 
                required: false
            }, 
            cancellation_status: {
                type: 'boolean', 
                required: false
            }, 
            user_id: {
                type: 'number', 
                required: true
            }
        };
    }
}

module.exports = new TaskController();
