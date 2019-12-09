const { Tedis } = require('tedis');
const redisConfig = require('../../config/redis');

module.exports = new Tedis({
    host: redisConfig.host, 
    port: redisConfig.port, 
    password: redisConfig.password
});
