'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tasks', { 
      id: {
        allowNull: false, 
        primaryKey: true, 
        autoIncrement: true, 
        type: Sequelize.INTEGER
      }, 
      name: {
        allowNull: false, 
        type: Sequelize.STRING
      }, 
      description: {
        allowNull: false, 
        type: Sequelize.STRING
      }, 
      completion_status: {
        allowNull: false, 
        type: Sequelize.BOOLEAN
      }, 
      cancellation_status: {
        allowNull: false, 
        type: Sequelize.BOOLEAN
      }, 
      created_at: {
        allowNull: false, 
        type: Sequelize.DATE
      }, 
      updated_at: {
        allowNull: false, 
        type: Sequelize.DATE
      }, 
      user_id: {
        allowNull: false, 
        type: Sequelize.INTEGER, 
        references: { model: 'users', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE', 
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tasks');
  }
};
