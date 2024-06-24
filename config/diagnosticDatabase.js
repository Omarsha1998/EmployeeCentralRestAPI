module.exports = {
  user: process.env.DB_USER2,
  password: process.env.DB_PASS2,
  server: process.env.DB_HOST2,
  database: process.env.DB_DB2,
  options: {
    enableArithAbort: true,
    encrypt: false,
    appName: "node-rest-api",
  },
  dialectOptions: {
    appName: "node-rest-api",
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
  pool: {
    idleTimeoutMillis: 30000,
    max: 100,
  },
};