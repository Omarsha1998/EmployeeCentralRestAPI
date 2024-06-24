const mssql = require("mssql");
const defaultDbConn = require("./dbConns.js").default;
const testDbConn = require("./dbConns.js").test;
const defaultDbConfig = require("../config/databaseConfig.js");

let dbConn = defaultDbConn;

if (process.env.NODE_ENV === "dev" || process.env.DEV) {
  dbConn = testDbConn;
  console.log(`Using TESTING SQL Server Database.`);
} else {
  console.log(`Using LIVE SQL Server Database.`);
}

const {
  empty,
  isStr,
  isArr,
  isObj,
  objEmpty,
  changeCase,
  pascalToCamel,
  generateNumber,
  jsDateToISOString,
  pad,
} = require("./util.js");

const formatQueryError = (error) => {
  const isSqlError =
    error instanceof mssql.ConnectionError ||
    error instanceof mssql.TransactionError ||
    error instanceof mssql.RequestError ||
    error instanceof mssql.PreparedStatementError;

  // if (process.env.DEV && isSqlError) console.log(error);

  return { error: isSqlError ? "Database Error" : error };
};

// Used to generate SQL Where Clause using an object containing
// all the conditions for the query.
// IMPORTANT: Always use this in tandem with `args` helper.
const where = (obj) => {
  if (empty(obj)) return "";

  if (!isObj(obj))
    throw "`where` mssql helper: `obj` argument, when not empty, should be an object.";

  const ret = [];

  for (const i in obj) {
    ret.push(obj[i] == null ? `${i} IS NULL` : `${i} = ?`);
  }

  return `WHERE ${ret.join(" AND ")}`;
};

const args = (obj) => {
  if (empty(obj)) return [];

  if (!isObj(obj))
    throw "`args` mssql helper: `obj` argument, when not empty, should be an object.";

  const ret = [];

  for (const i in obj) {
    if (obj[i] == null) continue;
    ret.push(obj[i]);
  }

  return ret;
};

// Optimized/combined `where` and `args`
const cond = (obj, colPrefix = "") => {
  if (empty(obj)) {
    return {
      whereStr: "",
      whereArgs: [],
    };
  }

  if (!isStr(colPrefix)) throw "`colPrefix` should be a string.";

  if (!isObj(obj))
    throw "`where` mssql helper: `obj` argument, when not empty, should be an object.";

  const prefix = colPrefix ? colPrefix + "." : "";
  const whereStrArr = [];
  const whereArgs = [];

  for (const key in obj) {
    const colName = `${prefix}${key}`;

    if (
      obj[key] == null ||
      obj[key] === "null" ||
      obj[key] === "undefined" ||
      obj[key] === ""
    ) {
      whereStrArr.push(`(${colName} IS NULL OR ${colName} = '')`);
      continue;
    }

    whereStrArr.push(`${colName} = ?`);
    whereArgs.push(obj[key]);
  }

  return {
    whereStr: `WHERE ${whereStrArr.join(" AND ")}`,
    whereArgs,
  };
};

const query = async (command, args, conn, camelized = true) => {
  // NOTE: `conn` can be a mssql.ConnectionPool or a mssql.Transaction

  // console.log("sql query helper, command: ", command);
  // console.log("sql query helper, args: ", args);

  if (!conn) conn = dbConn;
  if (args == null) args = [];

  try {
    if (conn instanceof mssql.ConnectionPool && !conn._connected) {
      // console.log("Connecting to db...");
      await conn.connect();
    }

    const result = await new mssql.Request(conn).query(
      command.split("?"),
      ...args
    );

    if (result.recordset) {
      if (camelized)
        return result.recordset.map((row) => changeCase(row, pascalToCamel));

      return result.recordset;
    }

    return result;
  } catch (error) {
    // console.log("`query` helper: ", error);
    // Let `transact` handle the error if this is ran inside `transact`
    if (conn instanceof mssql.Transaction) throw error;
    return formatQueryError(error);
  }
};

const transact = async (commands, conn) => {
  if (!conn) conn = dbConn;

  try {
    if (!conn._connected) {
      // console.log("Connecting to db...");
      await conn.connect();
    }

    const txn = new mssql.Transaction(conn);

    // IMPORTANT: begin transaction here as rolling back a transaction that
    // has not been started throws an error
    await txn.begin();

    try {
      // IMPORTANT: Throw an error inside the `commands` arg to force a "rollback"
      const ret = await commands(txn);
      await txn.commit();

      return ret;
    } catch (error) {
      // console.log("`transact` helper: ", error);
      // console.log("Error occured in a transaction. Rolling back...");
      await txn.rollback();
      // console.log("Rolled back.");
      return formatQueryError(error);
    }
  } catch (error) {
    // console.log("`transact` helper: ", error);
    return formatQueryError(error);
  }
};

const select = async (columns, table, conditions, txn) => {
  if (empty(columns) || empty(table))
    throw "`columns` and `table` arguments are required.";

  const command = `SELECT
    ${isArr(columns) ? columns.join(",") : columns}
    FROM ${table}
    ${where(conditions)};`;

  return await query(command, args(conditions), txn);
};

const selectOne = async (columns, table, conditions, txn) => {
  if (empty(columns) || empty(table) || empty(conditions))
    throw "`columns`, `table` and `conditions` arguments are required.";

  const command = `SELECT TOP 1
    ${isArr(columns) ? columns.join(",") : columns}
    FROM ${table}
    ${where(conditions)};`;

  return (await query(command, args(conditions), txn))[0] ?? null;
};

const insert = async (
  table,
  item,
  txn,
  creationDateTimeField = "dateTimeCreated"
) => {
  if (empty(table) || empty(item) || empty(txn))
    throw "`table`, `item` and `txn` arguments are required.";

  const newItem = {
    ...item,
    [creationDateTimeField]: new Date(),
  };

  const sqlCols = [];
  const sqlValuePlaceholders = [];
  const sqlValues = [];

  for (const key in newItem) {
    sqlCols.push(key);
    sqlValuePlaceholders.push("?");
    sqlValues.push(newItem[key]);
  }

  const command = `INSERT INTO ${table} (
    ${sqlCols.join(",")}
  ) OUTPUT INSERTED.* VALUES (
    ${sqlValuePlaceholders.join(",")}
  );`;

  // console.log("sql insert helper, command: ", command);
  // console.log("sql insert helper, args: ", sqlValues);

  return (await query(command, sqlValues, txn))[0] ?? null;
};

const insertMany = async (table, items, txn) => {
  if (empty(table) || empty(items) || empty(txn))
    throw "`table`, `items` and `txn` arguments are required.";

  const ret = [];

  for (const item of items) {
    ret.push(await insert(table, item, txn));
  }

  return ret;
};

const update = async (
  table,
  item,
  conditions,
  txn,
  updateDateTimeField = "dateTimeUpdated"
) => {
  if (empty(table) || empty(item) || empty(conditions) || empty(txn))
    throw "`table`, `item`, `conditions` and `txn` arguments are required.";

  const setClauseArr = [];

  // We'll modify `item` here so let's clone it to avoid unpredictable mutations to the original `item`
  const itemCopy = { ...item };

  itemCopy[updateDateTimeField] = new Date();

  for (const key in itemCopy) {
    if (itemCopy[key] !== undefined) setClauseArr.push(`${key} = ?`);
  }

  const command = `UPDATE ${table} SET
    ${setClauseArr.join(",")}
    ${where(conditions)};`;

  const condArgs = [
    ...Object.values(itemCopy).filter((v) => v !== undefined),
    ...args(conditions),
  ];

  // console.log(command);
  // console.log(condArgs);

  await query(command, condArgs, txn);
  return await selectOne("*", table, conditions, txn);
};

const upsert = async (
  table,
  item,
  identityColumnsMap,
  createdOrUpdatedBy,
  txn,
  createdByField = "createdBy",
  creationDateTimeField = "dateTimeCreated",
  updatedByField = "updatedBy",
  updateDateTimeField = "dateTimeUpdated"
) => {
  if (
    empty(table) ||
    objEmpty(item) ||
    objEmpty(identityColumnsMap) ||
    empty(createdOrUpdatedBy) ||
    empty(txn)
  )
    throw "`table`, `item`, `identityColumnsMap`, `createdOrUpdatedBy` and `txn` arguments are required.";

  if (Object.keys(identityColumnsMap).length < 2)
    throw "`identityColumnsMap` should have two or more items.";

  const existingItem = await selectOne("*", table, identityColumnsMap, txn);

  if (existingItem) {
    let noChanges = true;

    for (const key in item) {
      if (item[key] !== existingItem[key]) {
        noChanges = false;
        break;
      }
    }

    if (noChanges) {
      // console.log("No Changes to the item. Returning the existing one...");
      return existingItem;
    }

    // console.log("upsert: Updating existing item...");
    return await update(
      table,
      { ...item, [updatedByField]: createdOrUpdatedBy },
      identityColumnsMap,
      txn,
      updateDateTimeField
    );
  }

  // console.log("upsert: Inserting new item...");
  return await insert(
    table,
    { ...item, ...identityColumnsMap, [createdByField]: createdOrUpdatedBy },
    txn,
    creationDateTimeField
  );
};

const del = async (table, conditions, txn) => {
  if (empty(table) || empty(conditions) || empty(txn))
    throw "`table`, `conditions` and `txn` arguments are required.";

  const ret = await selectOne("*", table, conditions, txn);

  await query(
    `DELETE FROM ${table} ${where(conditions)};`,
    args(conditions),
    txn
  );

  return ret;
};

const generateRowCode = async (table, prefix, count, txn) => {
  if (!txn) throw "generateRowCode: `txn` arg is required.";

  let code = "";
  let codeExists = true;

  const dateTimeStr = jsDateToISOString(new Date(), false).replace(
    /[ -.\:]/g,
    ""
  );

  while (codeExists) {
    code = `${prefix}${dateTimeStr}${generateNumber(count)}`;

    const result = await query(
      `SELECT
          COUNT(code) AS count
        FROM
          ${table}
        WHERE
          Code = ?;`,
      [code],
      txn
    );

    codeExists = Boolean(result[0].count);
  }

  return code;
};

const generateUniqueCode = async (
  table,
  prefix,
  count,
  surrogateCode = "code",
  txn
) => {
  let code = "";
  let codeExists = true;

  var currentdate = new Date();

  var datetime = `${currentdate.getFullYear()}${(
    "0" +
    (currentdate.getMonth() + 1)
  ).slice(-2)}${pad(currentdate.getDate())}${pad(currentdate.getHours())}${pad(
    currentdate.getMinutes()
  )}${pad(currentdate.getSeconds())}`;
  while (codeExists) {
    code = `${prefix}${datetime}${generateNumber(count)}`;
    try {
      let result = await query(
        `SELECT
          COUNT(code) AS count
        FROM ${table} WITH (NOLOCK)
        where code = ?`,
        [code],
        txn
      );
      const codeCount = result;
      codeExists = Boolean(codeCount.count);
    } catch (error) {
      console.log(error);
      return { success: false, message: error };
    }
  }
  return code;
};

const generateDynamicUniqueCode = async (
  table,
  prefix,
  count,
  surrogateCode = "code",
  withTime = true,
  txn
) => {
  let code = "";
  let codeExists = true;

  var currentdate = new Date();

  let time = ``;
  if (withTime) {
    time = `${pad(currentdate.getHours())}${pad(currentdate.getMinutes())}${pad(
      currentdate.getSeconds()
    )}`;
  }
  var datetime = `${currentdate.getFullYear()}${(
    "0" +
    (currentdate.getMonth() + 1)
  ).slice(-2)}${pad(currentdate.getDate())}${time}`;
  while (codeExists) {
    code = `${prefix}${datetime}${generateNumber(count)}`;
    try {
      let result = await query(
        `SELECT
          COUNT(${surrogateCode}) AS count
        FROM ${table} WITH (NOLOCK)
        where ${surrogateCode} = ?`,
        [code],
        txn
      );
      const codeCount = result;
      codeExists = Boolean(codeCount.count);
    } catch (error) {
      console.log(error);
      return { success: false, message: error };
    }
  }
  return code;
};

const returnSQL = async () => {
  if (!defaultDbConn._connected) await defaultDbConn.connect();
  return defaultDbConn;
};

const returnSQLConfig = async () => {
  return defaultDbConfig;
};

module.exports = {
  where,
  args,
  cond,
  query,
  transact,
  select,
  selectOne,
  insert,
  insertMany,
  update,
  upsert,
  del,
  generateRowCode,
  generateUniqueCode,
  returnSQL,
  returnSQLConfig,
  generateDynamicUniqueCode,
};
