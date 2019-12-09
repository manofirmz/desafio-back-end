module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        name: DataTypes.STRING, 
        description: DataTypes.STRING, 
        completion_status: DataTypes.BOOLEAN, 
        cancellation_status: DataTypes.BOOLEAN
    }, {
        hooks: {
            beforeSave (task) {
                if (!task.completion_status) {
                    task.completion_status = false;
                }

                if (!task.cancellation_status) {
                    task.cancellation_status = false;
                }
            }
        }
    });

    Task.associate = models => {
        Task.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return Task;
};
