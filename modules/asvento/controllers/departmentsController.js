const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

// MODELS //
const departments = require("../models/departments.js");
// MODELS //

const getDepartments = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let args = [];
    sqlWhere = `and active = ? `;
    args = [1];
    let options = {
      top: "",
      order: "",
    };
    return await departments.selectDepartments(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};



module.exports = {
  getDepartments,

};
