require('dotenv').config();
const path = require('path');

const express = require('express');

class App {
    constructor () {
        this.express = express();
        this.middlewares();
        this.routes();
    }

    middlewares () {
        this.express.use(express.json());
    }

    routes () {
        require(path.resolve(__dirname, 'app', 'routes'))(this.express);
    }
}

module.exports = new App().express;
