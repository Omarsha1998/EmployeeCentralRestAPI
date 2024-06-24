const mssql = require("mssql");

let config = require("../config/databaseConfig");
config = config.sqlConfig;

const {
  empty,
  changeCase,
  pascalToCamel,
  isArr,
  pad,
  generateNumber,
  currentDateTime,
} = require("./util.js");

// Used to generate SQL Where Clause using an object containing
// all the conditions for the query
const where = function (obj) {
  if (empty(obj)) return "";

  if (typeof obj !== "object")
    throw "`where` mssql helper: `obj` argument should be an object.";

  const ret = [];

  for (const i in obj) {
    if (obj[i] !== undefined)
      ret.push(obj[i] === null ? `${i} IS NULL` : `${i} = ?`);
  }

  return `WHERE ${ret.join(" AND ")}`;
};

const args = function (obj) {
  if (empty(obj)) return [];

  if (typeof obj !== "object")
    throw "`args` mssql helper: `obj` argument should be an object.";

  const ret = [];

  for (const i in obj) {
    if (obj[i] !== undefined && obj[i] !== null) ret.push(obj[i]);
  }

  return ret;
};

const query = async function (command, args, txn = null, formatRowFn = null) {
  let ret = [];

  if (process.env.NODE_ENV === "dev") {
    console.log("query helper, command: ", command);
    console.log("query helper, args: ", args);
  }
  
  
  if (txn === null) {
    try {
      await mssql.connect(config);

      if (process.env.NODE_ENV === "dev") console.log(command);

      ret = await mssql.query(command.split("?"), ...(args ?? []));
    } catch (error) {
      console.log(error);
      ret = { error: "Unable to communicate with the database." };
    }
  } else {
    ret = await new mssql.Request(txn).query(
      command.split("?"),
      ...(args ?? [])
    );
  }

  if (ret.recordset) {
    const result = [];

    for (const row of ret.recordset) {
      let newRow = changeCase(row, pascalToCamel);
      if (formatRowFn) newRow = formatRowFn(newRow);
      result.push(newRow);
    }

    return result;
  }

  return ret;
};

const transact = async function (commands) {
  try {
    // Use global connection pool
    await mssql.connect(config);

    // New transaction
    const txn = new mssql.Transaction();

    // IMPORTANT: begin transaction here as rolling back a transaction that
    // has not been started throws an error
    await txn.begin();

    try {
      // IMPORTANT: Throw an error inside the `commands` arg to trigger a "rollback"
      const ret = await commands(txn);
      await txn.commit();

      return ret;
    } catch (error) {
      if (process.env.NODE_ENV) console.log(error);
      await txn.rollback();
      return { error };
    }
  } catch (error) {
    console.log(error);
    return { error: "Unable to communicate with the database." };
  }
};

/*
 * table (String) - table name
 * columns (Array) - contains names of columns to include in the query
 * conditions (Object) - conditions of SQL WHERE Clause
 */
const select = async function (columns, table, conditions, txn, options) {
  if (empty(columns) || empty(table))
    throw "`columns` and `table` arguments are required.";

  let selectOptions = options === undefined ? "" : options;
  const command = `SELECT ${
    empty(selectOptions.top) ? "" : `TOP(${selectOptions.top})`
  }
    ${isArr(columns) ? columns.join(",") : columns}
    FROM ${table}
    ${empty(conditions) ? "" : where(conditions)}
    ${empty(selectOptions.order) ? "" : `ORDER BY ${selectOptions.order}`}
    ;`;

  // if (process.env.NODE_ENV) console.log(command, args(conditions));

  return await query(command, args(conditions), txn);
};

const selectOne = async function (columns, table, conditions, txn) {
  if (empty(columns) || empty(table) || empty(conditions))
    throw "`columns`, `table` and `conditions` arguments are required.";

  const command = `SELECT TOP 1
    ${isArr(columns) ? columns.join(",") : columns}
    FROM ${table}
    ${where(conditions)};`;

  if (process.env.NODE_ENV) console.log(command, args(conditions));

  const items = await query(command, args(conditions), txn);

  return items[0] ?? null;
};

const insert = async function (
  table,
  item,
  txn,
  creationDateTimeField = "dateTimeCreated"
) {
  if (empty(table) || empty(item) || empty(txn))
    throw "`table`, `item` and `txn` arguments are required.";

  const newItem = {
    ...item,
    [creationDateTimeField]: await currentDateTime(),
    // [creationDateTimeField]: new Date(),
  };

  const command = `INSERT INTO ${table} (
    ${Object.keys(newItem).join(",")}
  ) VALUES (
    ${Object.values(newItem)
      .map(() => "?")
      .join(",")}
  );`;

  console.log("insert helper, command: ", command);
  // console.log("insert helper, args: ", Object.values(newItem));

  await query(command, Object.values(newItem), txn);

  const items = await query(
    `SELECT TOP 1 * FROM ${table} ORDER BY Id DESC;`,
    null,
    txn
  );

  return items[0];
};

const insertMany = async function (table, items, txn) {
  if (empty(table) || empty(items) || empty(txn))
    throw "`table`, `items` and `txn` arguments are required.";

  const ret = [];

  for (const item of items) {
    ret.push(await insert(table, item, txn));
  }

  return ret;
};

const update = async function (
  table,
  item,
  conditions,
  txn,
  updateDateTimeField = "dateTimeUpdated"
) {
  if (empty(table) || empty(item) || empty(conditions))
    throw "`table`, `item`, `conditions` and `txn` arguments are required.";

  const setClauseArr = [];

  // We'll modify `item` here so let's clone it to avoid unpredictable mutations to the original `item`
  const itemCopy = { ...item };

  itemCopy[updateDateTimeField] = await currentDateTime();
  // itemCopy[updateDateTimeField] = new Date();

  for (const key in itemCopy) {
    if (itemCopy[key] !== undefined) setClauseArr.push(`${key} = ?`);
  }

  const command = `UPDATE ${table} SET
    ${setClauseArr.join(",")}
    ${where(conditions)};`;
  if (process.env.NODE_ENV === "dev") console.log(command);
  // console.log(command, setClauseArr.join(","), conditions);

  const condArgs = [
    ...Object.values(itemCopy).filter((v) => v !== undefined),
    ...args(conditions),
  ];

  await query(command, condArgs, txn);
  const ret = await select("*", table, conditions, txn);

  return ret[0] ?? null;
};

const generateUniqueCode = async (table, prefix, count, txn) => {
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
        FROM ${table}
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

const returnSQL = async () => {
  const sqlConnect = await mssql.connect(config);
  return sqlConnect
}

module.exports = {
  where,
  args,
  query,
  transact,
  select,
  selectOne,
  insert,
  insertMany,
  update,
  generateUniqueCode,
  returnSQL
};
