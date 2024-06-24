require('dotenv/config')

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_DB,
    options: {
        enableArithAbort: true,
        encrypt: false,
        appName: 'node-rest-api'
    },
    dialectOptions: {
        appName: 'node-rest-api'
    },
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
        idleTimeoutMillis: 300000,
        max: 100,
    },
};

module.exports = sqlConfig