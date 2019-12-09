'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tasks', [{
      name: 'Criar API REST da lista de tarefas',
      description: 'Desafio backend da Republica Interativa', 
      completion_status: false, 
      cancellation_status: false, 
      created_at: new Date(), 
      updated_at: new Date(), 
      user_id: 1
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tasks', null, {});
  }
};
