const app = require('./app');

app.listen(process.env.PORT, () => 
    console.log(`App rodando em http://0.0.0.0:${process.env.PORT}`));
