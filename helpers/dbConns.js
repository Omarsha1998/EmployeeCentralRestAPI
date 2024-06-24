const mssql = require("mssql");
const dbProd = require("../config/databaseConfig.js");
const dbDev = require("../config/databaseTestingConfig.js");

let connectionPool;

if (process.env.NODE_ENV === "dev") {
  connectionPool = new mssql.ConnectionPool(dbDev);
} else {
  connectionPool = new mssql.ConnectionPool(dbProd);
}

module.exports = {
  default: connectionPool,
};
