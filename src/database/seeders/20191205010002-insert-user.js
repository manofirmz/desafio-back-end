'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      name: 'Rafael Felipe',
      email: 'manofirmz@gmail.com', 
      password_hash: '$2b$08$cD41sCFIIg4wRuOgAJ1pjONLk50N476aRCZg4UamLZ4dcU.8A5Uqy', 
      created_at: new Date(), 
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
