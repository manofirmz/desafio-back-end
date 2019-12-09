const { Task } = require('../models');

module.exports = async (request, response, next) => {
    const userId = request.userId;
    const taskId = request.params.id;
    const task = await Task.findByPk(taskId);

    if (!task) {
        const error = 'Task does not exists.';
        return response
            .status(404)
            .json({ error });
    }

    const unauthorized = userId !== task.user_id;

    if (unauthorized) {
        return response
            .status(401)
            .json({});
    }

    request.task = task;

    return next();
};
