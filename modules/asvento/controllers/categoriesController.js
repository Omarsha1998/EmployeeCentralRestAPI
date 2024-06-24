const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

// MODELS //
const categories = require("../models/categories.js");
// MODELS //

//all
const getCategories = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let args = [];
    sqlWhere = ` `;
    args = [];
    let options = {
      top: "",
      order: "",
    };
    return await categories.selectCategories(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

// const getItemCategories = async function (req, res) {
//   const returnValue = await sqlHelper.transact(async (txn) => {
//     let sqlWhere = "";
//     let parentCode= "FA"
//     let args = [];
//     sqlWhere = `and parentCode = ? `;
//     args = [parentCode];
//     let options = {
//       top: "",
//       order: "",
//     };
//     return await categories.selectItemCategories(sqlWhere, args, options, txn);
//   });

//   if (returnValue.error !== undefined) {
//     return res.status(500).json({ error: `${returnValue.error}` });
//   }
//   return res.json(returnValue);
// };


//without Computer Equipment
const getNonITCategories = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    const CEequipment = 21
    let args = [];
    sqlWhere = `and active = ? and categoryCode <> ?`;
    args = [1,CEequipment];
    let options = {
      top: "",
      order: "",
    };
    return await categories.selectCategories(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};


module.exports = {
  getCategories,
  getNonITCategories,
  // getItemCategories
};
