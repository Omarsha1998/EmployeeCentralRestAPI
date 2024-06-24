const util = require("../../../helpers/util.js");
const sqlHelper = require("../../../helpers/sql.js");

// MODELS //
const allotmentHistory = require("../models/allotmentHistory.js");
// MODELS //

//whole only
const getAllotmentHistory = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let equipType = "WHOLE"
    let transferStatus = "Approved"
    let args = [];
    sqlWhere = `and Active = ? and Type = ? and transferReStatus=?`;
    args = [1,equipType,transferStatus];
    let options = {
      top: "",
      order: "dateTimeCreated desc",
    };
    return await allotmentHistory.selectTransferHistory(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const getCondemHistoryParts = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let equipType = "PARTS"
    let condemReStatus = "Approved"
    let args = [];
    sqlWhere = `and Active = ? and Type = ? and condemReStatus=?`;
    args = [1,equipType,condemReStatus];
    let options = {
      top: "",
      order: "dateTimeCreated desc",
    };
    return await allotmentHistory.selectCondemHistory(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};
const getMaxId = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let args = [];
    sqlWhere = ``;
    args = [];
    let options = {
      top: "",
      order: "",
    };
    return await allotmentHistory.selectMaxTransferFormNo(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};
//parts only
const getAllotmentHistoryByParts = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let equipType = "PARTS"
    let transferStatus = "Approved"
    let args = [];
    sqlWhere = `and Active = ? and Type = ? and transferReStatus=?`;
    args = [1,equipType,transferStatus];
    let options = {
      top: "",
      order: "dateTimeCreated desc",
    };
    return await allotmentHistory.selectTransferHistory(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};


const getApprovedTransferPartsLog= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.internalAssetCode))
    return res.status(400).json({ error: "`Asset Code` is required." });
// const {internalAssetCode, transferFormNo}=req.body
  let internalAssetCode = req.query.internalAssetCode;
  let transferFormNo = req.query.transferFormNo;
    const transferReStatus = 'Approved(with whole)'
     let sqlWhere = "";
    let args = [];
    sqlWhere = `and transferReStatus=? and active =? and internalAssetCode = ? and transferFormNo = ?`;
    args = [transferReStatus,1,internalAssetCode,transferFormNo];

    let options = {
      top: "",
      order: "",
    };
    return await allotmentHistory.selectTransferHistory(
      sqlWhere,
      args,
      options,
      txn
    );
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const getApprovedTransferBYPartsLog= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.internalAssetCode))
    return res.status(400).json({ error: "`Asset Code` is required." });
// const {internalAssetCode, transferFormNo}=req.body
  let internalAssetCode = req.query.internalAssetCode;
  let transferFormNo = req.query.transferFormNo;
  let code = req.query.code;
    const transferReStatus = 'Approved'
     let sqlWhere = "";
    let args = [];
    sqlWhere = `and transferReStatus=? and active =? and internalAssetCode = ? and transferFormNo = ? and componentCode = ?`;
    args = [transferReStatus,1,internalAssetCode,transferFormNo,code];

    let options = {
      top: "",
      order: "",
    };
    return await allotmentHistory.selectTransferHistory(
      sqlWhere,
      args,
      options,
      txn
    );
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};



module.exports = {
  getAllotmentHistory,
  getAllotmentHistoryByParts,
  getApprovedTransferBYPartsLog,
  getApprovedTransferPartsLog,
  getMaxId,
  getCondemHistoryParts

  // getPartsLogApproved
};
