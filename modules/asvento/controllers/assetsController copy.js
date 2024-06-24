const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");
const multer =require('multer')

// MODELS //
const assets = require("../models/assets.js");
// const condemn = require("../models/condemn.js");
const assetsComponents = require("../models/assetsComponents.js");
// MODELS //

//get all asset with same transferCode
const getAssetToTransfer = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.transferFormNo))
      return res.status(400).json({ error: "`Transfer Form Number` is required." });

    let transferFormNo = req.query.transferFormNo;
  
    let sqlWhere = "";
    const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = `and receivingDepartment=?  and transferFormNo = ? and active=?`;
    args = [userDepartmentCode, transferFormNo,0];
    let options = {
      top: "",
      order: "",
    };
    return await assets.selectAssets(
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

const getAssetToTransferProperty = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.transferFormNo))
      return res.status(400).json({ error: "`Transfer Form Number` is required." });

    let transferFormNo = req.query.transferFormNo;
    let sqlWhere = "";
    const administrator ="IT"
    // const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = ` and transferFormNo = ? and active=? and administrator<>?`;
    args = [ transferFormNo,0,administrator];
    let options = {
      top: "",
      order: "",
    };
    return await assets.selectAssets(
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

const getAssetToTransferIT = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.transferFormNo))
      return res.status(400).json({ error: "`Transfer Form Number` is required." });

    let transferFormNo = req.query.transferFormNo;
    let sqlWhere = "";
    const administrator ="IT"
    // const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = ` and transferFormNo = ? and active=? and administrator=?`;
    args = [ transferFormNo,0,administrator];
    let options = {
      top: "",
      order: "",
    };
    return await assets.selectAssets(
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

const getAssetToCondemn = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.araForm))
      return res.status(400).json({ error: "`Ara Form No` is required." });

    let araForm = req.query.araForm;
    // console.log("araForm############################",araForm)
    let sqlWhere = "";
    const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = `and receivingDepartment=?  and araForm = ? and active=?`;
    args = [userDepartmentCode, araForm,0];
// console.log("@@@@@@@@@@@@@@@@@@@ sqlWhere",sqlWhere)
    let options = {
      top: "",
      order: "",
    };
    return await assets.selectAssets(
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
//get pending condemn requests by department
const getPartsToTCondemnByDept = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.araForm))
      return res.status(400).json({ error: "`ARA Form Number` is required." });
// let condemnRequestBy=req.query.condemnRequestBy
    let araForm = req.query.araForm;
    // console.log("araForm############################",araForm)
    let sqlWhere = "";
    const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = `and receivingDepartment=?  and araForm = ? and active=?`;
    args = [userDepartmentCode, araForm,0];
// console.log("@@@@@@@@@@@@@@@@@@@ sqlWhere",sqlWhere)
    let options = {
      top: "",
      order: "",
    };
    return await assetsComponents.selectAllParts(
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
//get all parts with same transferCode
const getPartsToTransfer = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.transferFormNo))
      return res.status(400).json({ error: "`Transfer Form Number` is required." });

    let transferFormNo = req.query.transferFormNo;
    let sqlWhere = "";
    const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = `and receivingDepartment=?  and transferFormNo = ? and active=?`;
    args = [userDepartmentCode, transferFormNo,0];
    let options = {
      top: "",
      order: "",
    };
    return await assetsComponents.selectAllParts(
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

const getPartsToTransferITEquip = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.transferFormNo))
      return res.status(400).json({ error: "`Transfer Form Number` is required." });

    let transferFormNo = req.query.transferFormNo;
    let sqlWhere = "";
    const administrator = 'IT'
    // const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = `and administrator=?  and transferFormNo = ? and active=?`;
    args = [administrator, transferFormNo,0];
    let options = {
      top: "",
      order: "",
    };
    return await assetsComponents.selectAllParts(
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

//by property
const getPartsToTransferProperty = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.transferFormNo))
      return res.status(400).json({ error: "`Transfer Form Number` is required." });

    let transferFormNo = req.query.transferFormNo;
    let sqlWhere = "";

    const administrator = 'IT'
    let args = [];
    sqlWhere = `and administrator<>?  and transferFormNo = ? and active=?`;
    args = [administrator, transferFormNo,0];
    let options = {
      top: "",
      order: "",
    };
    return await assetsComponents.selectAllParts(
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


//all equipment basta active
const getActiveEquipmentWhole = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let args = [];
    sqlWhere = `and condemnReStatus<>? `;
    args = ['Approved'];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//get distinct no duplicates ASSETS condemn/ ara
const getDistinctAraFormNo = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let condemnReStatus='Pending'
    const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = `and receivingDepartment=? and condemnReStatus=? and condemnStatus IS NOT NULL  `;
    args = [userDepartmentCode,condemnReStatus];
    let options = {
      top: "",
      order: "",
    };
    return await assets.ARAFormDistinct(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//get condemn
const getCondemnListProperty = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.araForm))
      return res.status(400).json({ error: "`ARA Form Number` is required." });

    let araForm = req.query.araForm;
    // console.log("araForm############################",araForm)
    let sqlWhere = "";
    const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = `and receivingDepartment=? and araForm = ? and active=?`;
    args = [userDepartmentCode, araForm,0];
    let options = {
      top: "",
      order: "",
    };
    return await assets.selectAssets(
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

//by property approval distinct
const getDistinctAraFormNoByProperty = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let condemnReStatus='Pending'
    // const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    
    sqlWhere = `and condemnReStatus=? and condemnStatus IS NOT NULL  `;
    args = [condemnReStatus];
    let options = {
      top: "",
      order: "",
    };
    return await assets.ARAFormDistinct(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//viewing for IT MONITORING
const getUpcomingCondemRequest = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let condemnReStatus='Pending'
    let administrator = 'IT'
    // const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    
    sqlWhere = `and condemnReStatus=? and condemnStatus IS NOT NULL  and administrator =?`;
    args = [condemnReStatus,administrator];
    let options = {
      top: "",
      order: "",
    };
    return await assets.ARAFormDistinct(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//get distinct by component ARA FORM by dept
const getDistinctAraFormByDeptParts = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let condemnReStatus='Pending'
    const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = `and receivingDepartment=? and condemnReStatus=? and araForm IS NOT NULL AND araForm <> '' `;
    args = [userDepartmentCode,condemnReStatus];
    let options = {
      top: "",
      order: "",
    };
    return await assets.selectPartsNoDuplicateARA(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//fortIT MONITORING
const getUpcomingPartsCondemRequest = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let condemnReStatus='Pending'
    let administrator = 'IT'
    const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = `and receivingDepartment=? and condemnReStatus=? and araForm IS NOT NULL AND araForm <> '' and administrator =?`;
    args = [userDepartmentCode,condemnReStatus,administrator];
    let options = {
      top: "",
      order: "",
    };
    return await assets.selectPartsNoDuplicateARA(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};



//get distinct no duplicates ASSETS transfer
const getDistinctTransferFormNo = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let transferReStatus='Pending'
    const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = `and receivingDepartment=? and transferReStatus=? and transferFormNo IS NOT NULL AND transferFormNo <> '' `;
    args = [userDepartmentCode,transferReStatus];
    let options = {
      top: "",
      order: "transferRequestedDate desc",
    };
    return await assets.selectAssetsNoDuplicate(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//get distinct no duplicate Components
const getDistinctTransferFormNoParts = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let transferReStatus='Pending(by parts)'
    const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = `and receivingDepartment=? and transferReStatus=? and transferFormNo IS NOT NULL AND transferFormNo <> '' `;
    args = [userDepartmentCode,transferReStatus];
    let options = {
      top: "",
      order: "transferRequestedDate desc",
    };
    return await assets.selectPartsNoDuplicate(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//approved asset log
const getApprovedAssetLogs= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.code))
    return res.status(400).json({ error: "`Asset Code` is required." });

  let code = req.query.code;
    // const transferReStatus = 'Approved'
     let sqlWhere = "";
    let args = [];
    sqlWhere = `and code = ?`;
    args = [code];

    let options = {
      top: "",
      order: "",
    };
    return await assets.selectAssets(
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


//by IT 
const getDistinctTransferFormNoPartsIT = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let transferReStatus='Pending(by parts)'
    const administrator = 'IT'
    let args = [];
    sqlWhere = `and administrator=? and transferReStatus=? and transferFormNo IS NOT NULL AND transferFormNo <> '' `;
    args = [administrator,transferReStatus];
    let options = {
      top: "",
      order: "",
    };
    return await assets.selectPartsNoDuplicate(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const getDistinctTransferFormNoPartsProperty = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let transferReStatus='Pending(by parts)'
    const administrator = 'IT'
    let args = [];
    sqlWhere = `and administrator<>? and transferReStatus=? and transferFormNo IS NOT NULL AND transferFormNo <> '' `;
    args = [administrator,transferReStatus];
    let options = {
      top: "",
      order: "",
    };
    return await assets.selectPartsNoDuplicate(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//for accounting
const getAssetsActive = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let args = [];
    sqlWhere = `and active=?`;
    args = [1];
    let options = {
      top: "",
      order: "CASE WHEN (accountingRefNo IS NULL OR accountingRefNo = '') THEN 0 WHEN (Capitalized IS NULL OR Capitalized = '') THEN 0 ELSE 1 END, DateTimeUpdated asc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};
//for accounting parts
const getPartsActive = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let args = [];
    sqlWhere = `and active=?`;
    args = [1];
    let options = {
      top: "",
      order: "CASE WHEN (accountingRefNo IS NULL OR accountingRefNo = '') THEN 0 WHEN (Capitalized IS NULL OR Capitalized = '') THEN 0 ELSE 1 END, DateTimeUpdated asc ",
    };
    return await assetsComponents.selectAllParts(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};


//display assets NON-IT and IT
const getAssets = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let args = [];
    sqlWhere = `and categoryId<>? and active=?`;
    args = [21,1];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};


//para sa searching ng asset code
const getSearcAssetCode = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";

    let args = [];
    sqlWhere = ``;
    args = [];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//for IT assetcode
const getSearcITAssetCode = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";

    let args = [];
    sqlWhere = ``;
    args = [];
    let options = {
      top: "",
      order: "",
    };
    return await assetsComponents.selectITAssetCodeExistence(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};


const getAssetsCE = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    const catId = 'IT'
    let args = [];
    sqlWhere = `and administrator = ? and active=?`;
    args = [catId,1];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const getAssetsCEnoAssetCode = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    const catId = 'IT'

    let args = [];
    sqlWhere = `and administrator = ? and active =? and (oldAssetCode = '' OR oldAssetCode IS NULL)  `;
    args = [catId,1];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const getAssetsByDepartment = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    const userDepartmentCode = util.currentUserToken(req).deptCode
   
    let args = [];
    sqlWhere = `and active = ? and receivingDepartment =?`;
    args = [1,userDepartmentCode];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const getAssetsByPassCondem = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
   
    let args = [];
    sqlWhere = `and active = ? `;
    args = [1];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};
//display AssetsPendingTransfers
const getAssetsPendingTransfers = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    const activeUsera = util.currentUserToken(req).deptCode
  
    let args = [];
    sqlWhere = `and transferStatus = ? and receivingDepartment =?`;
    args = [0,activeUsera];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//display Receiving Transfer mga for approval to (WHOLE) ADMIN
const getAssetsApprovalTransfers = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    // const activeUsera = util.currentUserToken(req).deptCode
     let args = [];
    sqlWhere = `and transferStatus = ? and active = ? and administrator <> ?`;
    args = [0,0,'IT'];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

// by property
const getDistinctApprovalTransferFormNo = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let transferReStatus='Pending'
    let administrator='IT'
    // const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = ` and transferReStatus=? and transferFormNo IS NOT NULL AND transferFormNo <> '' and administrator <> ?`;
    args = [transferReStatus,administrator];
    let options = {
      top: "",
      order: "transferRequestedDate desc",
    };
    return await assets.selectAssetsARANoDuplicate(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};


// by IT dept
const getCEDistinctApprovalTransferFormNo = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = ""; 
    let transferReStatus='Pending'
    let administrator='IT'
    // const userDepartmentCode = util.currentUserToken(req).deptCode
    let args = [];
    sqlWhere = ` and transferReStatus=? and transferFormNo IS NOT NULL AND transferFormNo <> '' and administrator = ?`;
    args = [transferReStatus,administrator];
    let options = {
      top: "",
      order: "",
    };
    return await assets.selectAssetsARANoDuplicate(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};




//display Receiving Transfer mga for approval to (PARTS) ADMIN
const getPartsApprovalTransfers = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    // const activeUsera = util.currentUserToken(req).deptCode
     let args = [];
    sqlWhere = `and transferStatus = ? and active = ? and administrator <> ?`;
    args = [0,0,"IT"];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assetsComponents.selectAllParts(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};




//display Receiving Transfer IT SIDE
const getCEApprovalTransfers = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
  
     let args = [];
    sqlWhere = `and transferStatus = ? and administrator = ?`;
    args = [0,'IT'];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//display parts for approval to transfer IT SIDE
const getCEApprovalTransfersParts = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
  
     let args = [];
    sqlWhere = `and transferStatus = ? and administrator = ?`;
    args = [0,'IT'];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assetsComponents.selectAllParts(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//for condemn by department viewing WHOLE
const getAssetsCondemnTransfer = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    const activeUsera = util.currentUserToken(req).deptCode


  

    let args = [];
    sqlWhere = `and condemnStatus = ? and receivingDepartment =?`;
    args = [0,activeUsera];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//for condemn by department viewing Parts
const getPartsCondemnTransfer = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    const userDepartment = util.currentUserToken(req).deptCode

    let args = [];
    sqlWhere = `and active = ? and condemnStatus = ? and receivingDepartment =?`;
    args = [0,0,userDepartment];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assetsComponents.selectAllParts(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//get all retired equipment for audit CE and non ce
const getAllRetiredWholeAsset = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let condemnReStatus ='Approved'
    let args = [];
    sqlWhere = `and condemnReStatus = ? and active=? `;
    args = [condemnReStatus,0];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });
  // console.log("test",returnValue)

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};


const getAllRetiredWholeAssetDepartment = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let internalAssetCode = req.query.code;
    let types ="WHOLE"
    let condemReStatus = "APPROVED"
    // let condemnReStatus ='Approved'
    let args = [];
    sqlWhere = `and asst.code=? and asstCompo.type=? and asstCompo.condemReStatus=? `;
    args = [internalAssetCode,types,condemReStatus ];
    let options = {
      top: "",
      order: "asst.dateTimeUpdated desc ",
    };
    return await assets.selectRetiredAssetsLog(sqlWhere, args, options, txn);
  });
  // console.log("test",returnValue)

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//CE RETIRED WHOLE ASSET - IT
const getRetiredCEWholeAsset = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let condemnReStatus ='Approved'
    let administrator ='IT'
    let args = [];
    sqlWhere = `and condemnReStatus = ? and active=? and administrator=?`;
    args = [condemnReStatus,0,administrator];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};


//CE RETIRED PARTS - IT
const getRetiredCEParts = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let condemnReStatus ='Approved'
    let administrator = 'IT'
    let args = [];
    sqlWhere = `and condemnReStatus = ? and active=? and administrator =? `;
    args = [condemnReStatus,0,administrator];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assetsComponents.selectAllParts(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};





//for condemn property viewing all needs to be condemn WHOLEEEEE
const getAssetsCondemnApproval = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let args = [];
    sqlWhere = `and condemnStatus = ? and active=? `;
    args = [0,0];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssets(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//PROPERTY view condemn requests PARTS
const getPartsCondemnForApproval = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let args = [];
    sqlWhere = `and condemnStatus = ? and active=? `;
    args = [0,0];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assetsComponents.selectAllParts(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//display old assets
const getOldAssets = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let args = [];
    sqlWhere = `and (transferred = ? OR transferred IS NULL)
    and (deleted = ? OR deleted IS NULL)`;

    // const sqlWhereArr = [
    //   "(transferred = ? OR transferred IS NULL)",
    //   "(deleted = ? OR deleted IS NULL)",
    // ];

    args = [0, 0];
    let options = {
      top: "",
      order: "",
    };

    return await assets.selectOldAssets(
      // sqlWhereArr.length > 0 ? `WHERE ${sqlWhereArr.join(" AND ")}` : "",
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

//POST REassignment
const postAssets = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
    // const assetsInfo = req.body.assetsInfo;
    const isAsset = req.body.isAsset;
    const { assetsInfo} = req.body;
    try {
      let generatedCode = "";
      if (isAsset) {
        let assetStatus = "";
        for (let asset of assetsInfo) {
          assetStatus = await sqlHelper.transact(async (txn) => {
            const catCode = asset.catCode;
            // const catCode = "catcode";
            generatedCode = await sqlHelper.generateUniqueCode(
              "UERMINV..Assets",
              catCode.toUpperCase(),
              2,
              txn
            );
      
            const activeUser = util.currentUserToken(req).code
            
            let assetsPayload = {
              code: generatedCode,
              assetCode: asset.newAssetCode,
              oldAssetCode: asset.oldAssetCode,
              receivingDepartment: asset.deptCode,
         
              itemCode: asset.itemCode,
              categoryId: asset.categoryCode,
              dateReceived: asset.dateReceived,
              supplierId: asset.supplierName,
              poNumber: asset.purchaseOrderNo,
              invoiceNumber: asset.invoiceNo,
              genericName: asset.genericName,
              brandName: asset.brandName,
              model: asset.brandModel,
              serialNumber: asset.serialNo,
              unitCost: asset.unitCost,
              status: asset.assetTagStatus,
              location: asset.physicalLocation,
              // dateTimeUpdated: util.currentDateTime(),
              updatedBy: activeUser,
              createdBy: activeUser,
              specifications: asset.specifications,
              remarks: asset.remarks,
              administrator:asset.administrator
            };

            // Insert Asset to the new Assets Table //
            let insertAssetStatus = await assets.insertAssets(
              assetsPayload,
              txn
            );
            // Insert Asset to the new Assets Table //

            // Update Old Assets Table //
            await assets.updateOldAssets(
              {
                transferred: true,
                dateTimeTransferred: util.currentDateTime(),
              },
              { itemId: asset.itemId },
              txn
            );
            // Update Old Assets Table //
            if (insertAssetStatus.error) {
              throw error.message;
            }
          });
        }
        assetStatus = { success: true };
        return assetStatus;
      } else {
        let assetComponentStatus = "";
        for (let assetComponent of assetsInfo) {
          assetComponentStatus = await sqlHelper.transact(async (txn) => {
            const catCode = assetComponent.catCode;
            generatedCode = await sqlHelper.generateUniqueCode(
              "UERMINV..AssetsComponents",
              `${catCode.toUpperCase()}AC`,
              2,
              txn
            );

            const assetCode = req.body.assetCode;
            let assetsComponentPayload = {
              code: generatedCode,
              assetCode: assetCode,
              genericName: assetComponent.genericName,
              brandName: assetComponent.brandName,
              internalAssetCode: assetComponent.newAssetCode,
            };

            // Insert Asset Component to the new Assets Component Table //
            //put condition inside insertAssetComponentStatus that if generated code if empty active field must be zero
            let insertAssetComponentStatus =
              await assetsComponents.insertAssetsComponents(
                assetsComponentPayload,
                txn
              );
            // Insert Asset Component to the new Assets Component Table //

            // Update Old Assets Table //
            await assets.updateOldAssets(
              {
                transferred: true,
                dateTimeTransferred: util.currentDateTime(),
                parentAsset: assetComponent.itemId,
              },
              { itemId: assetComponent.itemId },
              txn
            );
            // Update Old Assets Table //
            if (insertAssetComponentStatus.error) {
              throw error.message;
            }
          });
        }
        assetComponentStatus = { success: true };
        return assetComponentStatus;
      }
    } catch (error) {
      // console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};




//searchCode
// const getSearchCode = async function (req, res) {
//   const { code } = req.query.code; // Assuming the asset code is passed as a query parameter

//   if (!code) {
//     return res.status(400).json({ error: "`code` is required as a query parameter." });
//   }

//   const returnValue = await sqlHelper.transact(async (txn) => {
   
//     let sqlWhere = `and active = ?`;
//     let args = [1];

//     let options = {
//       top: "",
//       order: "dateTimeUpdated desc ",
//     };

//     return await assets.selectAssets(sqlWhere, args, options, txn);
//   });

//   if (returnValue.error !== undefined) {
//     return res.status(500).json({ error: `${returnValue.error}` });
//   }

//   return res.json(returnValue);
// };



const getSearchCode = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.code))
      return res.status(400).json({ error: "`Transfer Form Number` is required." });

    let transferFormNo = req.query.code;

    let sqlWhere = "";
  
    let args = [];
    sqlWhere = `and active=? and code =?`;
    args = [0,transferFormNo];

    let options = {
      top: "",
      order: "",
    };
    return await assets.selectAssets(
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




//post parts allotment transfer inserting mismo sa allotment history
const postPartsTransfer = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
    const { assetsInfo,transferToDeptCode,remarks,assetCodeResult} = req.body;
    try { 
      let generatedCode = "";
      let itemType="PARTS";
      let codePrefix = "P";
      let transferReStatus="Pending(by parts)"
     
      let generatedTransferFormCode=""
let tfPrefix="TF"
 generatedTransferFormCode = await sqlHelper.generateUniqueCode(
  "UERMINV..AssetsComponents",
  `${tfPrefix.toUpperCase()}`,
  6,
  txn
);

     let assetStatus = "";
        for (let asset of assetsInfo) {
          assetStatus = await sqlHelper.transact(async (txn) => {
            generatedCode = await sqlHelper.generateUniqueCode(
              "UERMINV..AssetsComponents",
              `${codePrefix.toUpperCase()}`,
              6,
              txn
            );
               
            const activeUser = util.currentUserToken(req).code
          
            let assetsPayload = {
              code: generatedCode,
              assetCode:asset.assetCode,
         fromDeptCode:asset.receivingDepartment,
         toDeptCode:transferToDeptCode,
         transferReStatus: transferReStatus,
         genericName:asset.componentGenericName,
         internalAssetCode:asset.internalAssetCode,
         transferFormNo:generatedTransferFormCode, 
              updatedBy: activeUser,
              createdBy: activeUser,
              transferStatus:false,
              remarks:remarks,
              transferStatus:false,
              type:itemType,
              transferringRequestedDate:asset.transferRequestedDate,
              tranferringAssetCode:assetCodeResult,
              componentCode:asset.componentCode,
            };
            // Insert to allotment history tbl // 
            let insertAssetStatus = await assets.insertAssetsTransfer(
              assetsPayload,
              txn
            );
       
// UPDATE PARTS INFO START//

await assetsComponents.updateAssetsComponents(
  {
   
    transferredDepartment:transferToDeptCode,
    active:false,
    transferFormNo:generatedTransferFormCode, 
    transferStatus:false,
    transferReStatus:transferReStatus,
    transferingAssetCode:assetCodeResult,
    transferRequestedDate:util.currentDateTime(),
    // condemnReStatus:condemnReStatus
  },
  { code: asset.componentCode },
  txn
);
//UPDATE PARTS INFO END//

// console.log("Updated Parts Info ########", asset.internalAssetCode);
// console.log("Updated Parts Info ########", componentCode);

            if (insertAssetStatus.error) {
              throw error.message;
            }
          });
        }
        assetStatus = { success: true };
        return assetStatus;
    
    } catch (error) {
      // console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};




//updating department
const postAssetsTransferChangeDepartment = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
    // const assetsInfo = req.body.assetsInfo;
    // const isAsset = req.body.isAsset;
    const { assetsInfo,transferToDeptCode} = req.body;
    try {
      // console.log("assetsInfo$$$$$$$$$", assetsInfo)
      let generatedCode = "10001";
     
        let assetStatus = "";
        for (let asset of assetsInfo) {
          assetStatus = await sqlHelper.transact(async (txn) => {
            // const catCode = asset.catCode;
            // const catCode = "catcode";
           
      
            const activeUser = util.currentUserToken(req).code
            
            let assetsPayload = {
              code: generatedCode,
         fromDeptCode:asset.deptCode,
         toDeptCode:transferToDeptCode,
       
        //  transferFormNo:transferFormNo, 
              // dateTimeUpdated: util.currentDateTime(),
              updatedBy: activeUser,
              createdBy: activeUser,
              transferStatus:false,
              remarks:remarks
              
             
         
            };
            // console.log("assetsPayload ########",assetsPayload)

            // Insert Asset to the new Assets Table //
            let insertAssetStatus = await assets.insertAssetsTransfer(
              assetsPayload,
              txn
            );
            // Insert Asset to the new Assets Table //

            // Update Old Assets Table //
            await assets.updateAssets(
              {
                // receivingDepartment: transferToDeptCode,
                transferredDepartment:transferToDeptCode,
                // dateTimeUpdated: util.currentDateTime(),
                // transferFormNo:transferFormNo, 
                updatedBy: activeUser,
                transferStatus:false,
                // remarks:remarks
                // active:false
              },
              { code: asset.code },
              txn
            );
            // Update Old Assets Table //
            if (insertAssetStatus.error) {
              throw error.message;
            }
          });
        }
        assetStatus = { success: true };
        return assetStatus;
    
    } catch (error) {
      // console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};



//SENDING REQUEST TO TRANSFER
const postAssetsTransfer = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
    let generatedCode = "";
    let prefixs= "w"
    let tfPrefix= "TFS"
  
    let transferReStat="Pending(with Whole)"
    let transferReStatWhole="Pending"
    let generatedTransferFormCode = "";
    const { assetsInfo,transferToDeptCode,remarks,partsInclude} = req.body;
    generatedCode = await sqlHelper.generateUniqueCode(
      "UERMINV..AssetAllotmentHistory",
        `${prefixs.toUpperCase()}-`,
      4,
      txn
    );
  let test = 4
    generatedTransferFormCode = await sqlHelper.generateUniqueCode(
      "UERMINV..AssetAllotmentHistory",
      `${tfPrefix.toUpperCase()}-`,
      `-${test}-`,
      txn
    );
    try {
      let itemType="WHOLE"
        let assetStatus = "";
        for (let asset of assetsInfo) {
          assetStatus = await sqlHelper.transact(async (txn) => {
            const activeUser = util.currentUserToken(req).code
            
            let assetsPayload = {
              code: generatedCode,
              assetCode:asset.oldAssetCode,
         fromDeptCode:asset.deptCode,
         toDeptCode:transferToDeptCode,
         transferFormNo:generatedTransferFormCode, 
         genericName:asset.genericName,
         transferReStatus:transferReStatWhole,
         transferringRequestedDate:util.currentDateTime(),
         internalAssetCode:asset.code,
              updatedBy: activeUser,
              createdBy: activeUser,
              transferStatus:false,
              remarks:remarks,
              type:itemType
            };
      
            // console.log("assetsPayload #1",assetsPayload)

            // Insert Asset to the new Assets Table //
            let insertAssetStatus = await assets.insertAssetsTransfer(
              assetsPayload,
              txn
            );
            // Insert Asset to the new Assets Table //

            // Update Old Assets Table //
            await assets.updateAssets(
              {
            
                transferredDepartment:transferToDeptCode,
                // dateTimeUpdated: util.currentDateTime(),
                transferFormNo:generatedTransferFormCode, 
                updatedBy: activeUser,
                transferStatus:false,
                transferReStatus:transferReStatWhole,
                active:false,
                TransferRequestBy:activeUser,
                allotmentRemarks:remarks,
              transferRequestedDate:util.currentDateTime()
              },
              { code: asset.code },
              txn
            );
            // Update Old Assets Table //

    
// UPDATE PARTS INFO START//
await assetsComponents.updateAssetsComponents(
  {
   
    transferredDepartment:transferToDeptCode,
    active:false,
    transferFormNo:generatedTransferFormCode, 
    transferReStatus:transferReStat,
    TransferRequestBy:activeUser,
    transferRequestedDate:util.currentDateTime()
    // transferStatus:false,

  },
  { internalAssetCode: asset.code },
  txn
);
//UPDATE PARTS INFO END//


// console.log("Updated Parts Info ########", componentCode);

            if (insertAssetStatus.error) {
              throw error.message;
            }
          });
        }
        let itemTypes="PARTS";
        let codePrefix = "P";
        
        let transferReStatus="Pending(with Whole)"
        for (let parts of partsInclude) {
          assetStatus = await sqlHelper.transact(async (txn) => {
            const activeUser = util.currentUserToken(req).code
            generatedCode = await sqlHelper.generateUniqueCode(
              "UERMINV..AssetAllotmentHistory",
              codePrefix.toUpperCase(),
              4,
              txn
            );
            let partsPayload = {
              code: generatedCode,
              assetCode:parts.assetCode,
         fromDeptCode:parts.receivingDepartment,
         toDeptCode:transferToDeptCode,
         transferReStatus: transferReStatus,
         genericName:parts.componentGenericName,
         internalAssetCode:parts.internalAssetCode,
         transferFormNo:generatedTransferFormCode, 
              updatedBy: activeUser,
              createdBy: activeUser,
              transferStatus:false,
              remarks:remarks,
              transferStatus:false,
              type:itemTypes,
              transferringRequestedDate:util.currentDateTime(),
              componentCode:parts.componentCode,
            };
      
            let insertAssetStatus = await assets.insertAssetsTransfer(
              partsPayload,
              txn
            );

            if (insertAssetStatus.error) {
              throw error.message;
            }
          });
        }


        assetStatus = { success: true };
        return assetStatus;


        
    
    } catch (error) {
      // console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};


//post condemn 1/13/2024by department
const postAssetsCondemn = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });
try {
   const returnValue = await sqlHelper.transact(async (txn) => {
   
    const { assetsInfo,partsIncluded} = req.body;
    // console.log("assetsInfo",assetsInfo )
    // console.log("partsIncluded",partsIncluded )
    let AFPrefix= "ARA-"
    let CondemnPrefix ="aclh"
    let generatedARAForm = "";
    let condemnReStatus="Pending"
    let condemnReStatusParts="Pending(with whole)"
generatedARAForm = await sqlHelper.generateUniqueCode(
      "UERMINV..CondemnationHistory",
      `${AFPrefix.toUpperCase()}`,
      4,
      txn
    );
 let generatedCode = "";
 

    try {
      let types ="WHOLE"
        let assetStatus = "";
        const activeUser = util.currentUserToken(req).code
        for (let asset of assetsInfo) {
          // console.log("asset loop",asset )
          assetStatus = await sqlHelper.transact(async (txn) => {
            generatedCode = await sqlHelper.generateUniqueCode(
              "UERMINV..CondemnationHistory",
              `${CondemnPrefix.toUpperCase()}`,
              4,
              txn
            );
         
            
            let assetsPayload = {
              code: generatedCode,
              assetCode:asset.oldAssetCode,
              internalAssetCode:asset.code,
              genericName:asset.genericName,
         requestedDepartment:asset.deptCode,
         condemRequestedDate:util.currentDateTime(),
              createdBy: activeUser,
              condemnStatus:false,   
              condemReStatus: condemnReStatus,
              araForm:generatedARAForm,
              active:false,
              type:types
            };
            let insertAssetStatus = await assets.insertAssetsCondemn(
              assetsPayload,
              txn
            );
          
            if (insertAssetStatus.error) {
              throw error.message;
            }
          });

          await assets.updateAssets(
            {
            condemnRequestBy:activeUser,
              updatedBy: activeUser,
              // auditedBy:auditedBy,   
            araForm:generatedARAForm,
              condemnStatus:false,
              condemRequestedDate:util.currentDateTime(),
              condemnReStatus:condemnReStatus,
              active:false
            },
            { code: asset.code },
            txn
          );
          // console.log("asset.code",asset.code)
  
         
  // const actis = 1;
          await assetsComponents.updateAssetsComponents(
  {
  active:false,
  araForm:generatedARAForm, 
  condemnReStatus:condemnReStatusParts,
  condemnRequestedDate:util.currentDateTime(),
  condemnRequestBy:activeUser,
  },
  { internalAssetCode: asset.code},
  txn );

        }



        

        let itemTypes="PARTS";
        let codePrefix = "P";
        let newCode = ""
        for (let parts of partsIncluded) {
          // console.log("parts loop",parts )
          // console.log("Looping through parts:", parts)
          assetStatus = await sqlHelper.transact(async (txn) => {
             newCode = await sqlHelper.generateUniqueCode(
          "UERMINV..CondemnationHistory",
         `${codePrefix.toUpperCase()}`,
          4,
          txn
        );
        const activeUser = util.currentUserToken(req).code
          
            let partsPayload = {
              code: newCode,
              assetCode:parts.componentAssetCode,
              requestedDepartment:parts.receivingDepartment,  
         condemReStatus: condemnReStatus,
         createdBy: activeUser,
         genericName:parts.componentGenericName,
         internalAssetCode:parts.internalAssetCode,
              condemnStatus:false,
              type:itemTypes,
              condemRequestedDate:util.currentDateTime(),
              componentCode:parts.componentCode,
              araForm:generatedARAForm,
              active:1
            };
      // console.log("partsPayload",partsPayload)
            let insertAssetStatus = await assets.insertAssetsCondemn(
              partsPayload,
              txn
            );

            if (insertAssetStatus.error) {
              throw error.message;
            }
          });
        }
      
        assetStatus = { success: true };
        return assetStatus;
    
    } catch (error) {
      // console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
} catch (error) {
  console.log(error)
}
 
};


//duplicate temporary module o condem module
const condemDirectApproval = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
   
    const { assetsInfo,partsIncluded,condemRequestInfo} = req.body;
  //  console.log("condem",condemRequestInfo)
    let CondemnPrefix ="aclha"
    let generatedARAForm = condemRequestInfo.araForm;
    let condemnReStatus="Approved"
    let   condemnReStatusParts="Approved(with whole)"

 let generatedCode = "";
 

    try {
      let types ="WHOLE"
        let assetStatus = "";
        const activeUser = util.currentUserToken(req).code
        const userDeptCode =util.currentUserToken(req).deptCode
        for (let asset of assetsInfo) {
          assetStatus = await sqlHelper.transact(async (txn) => {
            generatedCode = await sqlHelper.generateUniqueCode(
              "UERMINV..CondemnationHistory",
              `${CondemnPrefix.toUpperCase()}`,
              4,
              txn
            );
            let assetsPayload = {
              code: generatedCode,
              assetCode:asset.oldAssetCode,
              internalAssetCode:asset.code,
              genericName:asset.genericName,
         requestedDepartment:userDeptCode,//asset.deptCode
         condemRequestedDate:util.currentDateTime(),
              createdBy: activeUser,
              condemnStatus:true,   
              condemReStatus: condemnReStatus,
              araForm:generatedARAForm,
              active:true,
              type:types,
              releasedDate:condemRequestInfo.date,
              remarks:condemRequestInfo.remarks
            };
            let insertAssetStatus = await assets.insertAssetsCondemn(
              assetsPayload,
              txn
            );
            await assets.updateAssets(
              {
              condemnRequestBy:activeUser,
                updatedBy: activeUser,
                // auditedBy:auditedBy,   
              araForm:generatedARAForm,
                condemnStatus:true,
                condemRequestedDate:util.currentDateTime(),
                condemnReStatus:condemnReStatus,
                active:false,
                releasedDate:condemRequestInfo.date,
                condemRemarks:condemRequestInfo.remarks
              },
              { code: asset.code },
              txn
            );
// const actis = 1;

            await assetsComponents.updateAssetsComponents(
  {
    active:false,
    araForm:generatedARAForm, 
    condemnStatus:true,
    condemnReStatus:condemnReStatusParts,
    condemnRequestedDate:util.currentDateTime(),
    condemnRequestBy:activeUser,
    releasedDate:condemRequestInfo.date,
    condemRemarks:condemRequestInfo.remarks
    
  },
  { internalAssetCode: asset.code
   },
  txn 
//   araForm:asset.araForm,
// active:actis
          );
            if (insertAssetStatus.error) {
              throw error.message;
            }
          });

        }

        let itemTypes="PARTS";
        let codePrefix = "P";
        let newCode = ""
        for (let parts of partsIncluded) {
          // console.log("Looping through parts:", parts)
          assetStatus = await sqlHelper.transact(async (txn) => {
             newCode = await sqlHelper.generateUniqueCode(
          "UERMINV..CondemnationHistory",
         `${codePrefix.toUpperCase()}`,
          4,
          txn
        );
        // const activeUser = util.currentUserToken(req).code
          
            let partsPayload = {
              code: newCode,
              assetCode:parts.componentAssetCode,
              requestedDepartment:userDeptCode,  //parts.receivingDepartment
         condemReStatus: condemnReStatus,
         createdBy: activeUser,
         genericName:parts.componentGenericName,
         internalAssetCode:parts.internalAssetCode,
              condemnStatus:false,
              type:itemTypes,
              condemRequestedDate:util.currentDateTime(),
              componentCode:parts.componentCode,
              araForm:generatedARAForm,
              active:false,
              releasedDate:condemRequestInfo.date,
              remarks:condemRequestInfo.remarks
            };
      // console.log("partsPayload",partsPayload)
            let insertAssetStatus = await assets.insertAssetsCondemn(
              partsPayload,
              txn
            );

            if (insertAssetStatus.error) {
              throw error.message;
            }
          });
        }
      
        assetStatus = { success: true };
        return assetStatus;
    
    } catch (error) {
      // console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};



//condemn approved 1/13/2024 PROPERTY FINAL APPROVE
const postAssetsCondemnApproved = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
   
    const { assetsInfo,releasedDate,dispositionCode,araFormInfo,partsIncluded} = req.body;
    try {

      let generatedCode = "";
      let condemnReStatus="Approved"
      let   condemnReStatusParts="Approved(with whole)"
      let CondemnPrefix = "ACHLA"
        let assetStatus = "";
        let types ="WHOLE"
        for (let asset of assetsInfo) {

          assetStatus = await sqlHelper.transact(async (txn) => {
  
      generatedCode = await sqlHelper.generateUniqueCode(
        "UERMINV..CondemnationHistory",
        `${CondemnPrefix.toUpperCase()}`,
        4,
        txn
      );  
            const activeUser = util.currentUserToken(req).code
            
            let assetsPayload = {
              code: generatedCode,
              assetCode:asset.oldAssetCode,
         requestedDepartment:asset.receivingDepartment,
      outcome:dispositionCode,
      araForm:asset.araForm,

             
              // dateTimeUpdated: util.currentDateTime(),
              createdBy: activeUser,
              condemnStatus:true,
              active:true,
              genericName:asset.genericName,
              type:types,
              internalAssetCode:asset.code,
              condemReStatus:condemnReStatus,
    condemRequestedDate:asset.condemRequestedDate,
              releasedDate:releasedDate,
              updatedBy:asset.condemnRequestBy
             
         
            };
       

            // Insert Asset to the new CondemnationHistory //
            let insertAssetStatus = await assets.insertAssetsCondemn(
              assetsPayload,
              txn
            );
            // Insert Asset to the new CondemnationHistory //

            // Update Old Assets Table //
            await assets.updateAssets(
              {
              
                // dateTimeUpdated: util.currentDateTime(),
                updatedBy: activeUser,
                condemnStatus:true,
                condemnReStatus:condemnReStatus,
                condemnRequestBy:activeUser,
                active:false,
                releasedDate:releasedDate,
                outcome:dispositionCode

              },
              { araForm: araFormInfo.araForm },
              txn
            );
            // Update Old Assets Table //

// UPDATE PARTS INFO START//

await assetsComponents.updateAssetsComponents(
  {
   
   
    active:false,
    // araForm:generatedTransferFormCode, 
    condemnReStatus:condemnReStatusParts,
    condemnStatus:true,
    releasedDate:releasedDate,
    outcome:dispositionCode
  },
  { araForm: araFormInfo.araForm },
  txn
);
//UPDATE PARTS INFO END//

            if (insertAssetStatus.error) {
              throw error.message;
            } 
          });
        }

        let itemTypes="PARTS";
        let codePrefix = "P";
        let newCode = ""

        for (let parts of partsIncluded) {
          // console.log("Looping through parts postAssetsCondemnApproved:", parts)
          assetStatus = await sqlHelper.transact(async (txn) => {
             newCode = await sqlHelper.generateUniqueCode(
          "UERMINV..CondemnationHistory",
         `${codePrefix.toUpperCase()}`,
          4,
          txn
        );
        const activeUser = util.currentUserToken(req).code
          
            let partsPayload = {
              code: newCode,
              assetCode:parts.componentAssetCode,
              requestedDepartment:parts.receivingDepartment,  
         condemReStatus: condemnReStatus,
         createdBy: activeUser,
         outcome:dispositionCode,
         releasedDate:releasedDate,

         genericName:parts.componentGenericName,
         internalAssetCode:parts.internalAssetCode,
              condemnStatus:false,

              type:itemTypes,
              condemRequestedDate:parts.condemnRequestedDate,
              componentCode:parts.componentCode,
              araForm:parts.araForm,
              active:false
            };
      // console.log("partsPayload",partsPayload)
            let insertAssetStatus = await assets.insertAssetsCondemn(
              partsPayload,
              txn
            );

            if (insertAssetStatus.error) {
              throw error.message;
            }
          });
        }

        assetStatus = { success: true };
        return assetStatus;
    
    } catch (error) {
      // console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const postPartsCondemnApproved = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
   
    const { assetsInfo,dispositionCode,releasedDate,partsInfo} = req.body;
    try {
    let condemnReStatus="Approved"
      let generatedCode = "";
     let itemTypes="PARTS"
        let assetStatus = "";
    let codePrefix = "PCHLA"
for (let partsIncluded of partsInfo){
          assetStatus = await sqlHelper.transact(async (txn) => {
            const activeUser = util.currentUserToken(req).code
            generatedCode = await sqlHelper.generateUniqueCode(
              "UERMINV..CondemnationHistory",
             `${codePrefix.toUpperCase()}`,
              4,
              txn
            );
           
            
            let assetsPayload = {
//               code: generatedCode,
//               assetCode:partsInfo.assetCode,
//          requestedDepartment:partsInfo.receivingDepartment,
      
             
//               // dateTimeUpdated: util.currentDateTime(),
//               updatedBy: activeUser,
//               createdBy: activeUser,
//               condemnStatus:true,
//               releasedDate:releasedDate,
// outcome:dispositionCode

code: generatedCode,
assetCode:partsIncluded.componentAssetCode,
requestedDepartment:partsIncluded.receivingDepartment,  
condemReStatus: condemnReStatus,
createdBy: activeUser,
genericName:partsIncluded.componentGenericName,
internalAssetCode:partsIncluded.movedAssetCode,
condemnStatus:true,
type:itemTypes,
condemRequestedDate:partsIncluded.condemnRequestedDate,
componentCode:partsIncluded.componentCode,
araForm:partsIncluded.araForm,
active:true,
releasedDate:releasedDate,
outcome:dispositionCode
             
            };
         

            // Insert Asset to the new CondemnationHistory //
            let insertAssetStatus = await assets.insertAssetsCondemn(
              assetsPayload,
              txn
            );
            // Insert Asset to the new CondemnationHistory //

// UPDATE PARTS INFO START//

await assetsComponents.updateAssetsComponents(
  {
   
    releasedDate:releasedDate,
    outcome:dispositionCode,
    updatedBy: activeUser,
    active:false,
    condemnStatus:true,
    condemnReStatus:condemnReStatus
  },
  { araForm: assetsInfo.araForm },
  txn
);
//UPDATE PARTS INFO END//

            if (insertAssetStatus.error) {
              throw error.message;
            } 
          });
       
        }

        assetStatus = { success: true };
        return assetStatus;
    
    } catch (error) {
      // console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};






//condemn request parts
const postSendCondemnRequestParts = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
   
    const { assetsInfo} = req.body;

    let AFPrefix= "ARA-"
    let condemnReStatus = 'Pending'
    let chlRestatus= 'Pending(parts only)'
    let generatedARAForm = "";
    const activeUser = util.currentUserToken(req).code
generatedARAForm = await sqlHelper.generateUniqueCode(
      "UERMINV..AssetsComponents",
      `${AFPrefix.toUpperCase()}`,
      4,
      txn
    );
    try {
    
    let CondemnPrefix = "PCHL"
      let generatedCode = "";
      let type = "PARTS"
      generatedCode = await sqlHelper.generateUniqueCode(
        "UERMINV..CondemnationHistory",
        `${CondemnPrefix.toUpperCase()}`,
        4,
        txn
      );
        let assetStatus = "";
        for (let asset of assetsInfo) {
          assetStatus = await sqlHelper.transact(async (txn) => {
 
          
            
            let assetsPayload = {
              code: generatedCode,
              assetCode:asset.oldAssetCode,
         requestedDepartment:asset.receivingDepartment,
         condemReStatus:chlRestatus,
         internalAssetCode:asset.internalAssetCode,
        //  requestedDepartment:transferToDeptCode,
        condemRequestedDate:util.currentDateTime(),
        componentCode:asset.componentCode,
        assetCode:asset.assetCode,
              // dateTimeUpdated: util.currentDateTime(),
              // updatedBy: activeUser,
              genericName:asset.componentGenericName,
              createdBy: activeUser,
              condemnStatus:false,   
              // auditedBy:auditedBy,   
              araForm:generatedARAForm,
              type:type,
              active:false
              
         
            };


            // Insert Asset to the condemn history Table //
            let insertAssetStatus = await assets.insertAssetsCondemn(
              assetsPayload,
              txn
            );
            // Insert Asset to the condemn history Table //
            // UPDATE PARTS INFO START//
// let clearInternalAssetCode = null
await assetsComponents.updateAssetsComponents(
  {
  //  movedAssetCode:asset.internalAssetCode,
  //   internalAssetCode:clearInternalAssetCode,
    active:false,
    araForm:generatedARAForm, 
    condemnStatus:false,
    condemnReStatus:condemnReStatus,
    condemnRequestedDate:util.currentDateTime(),
    updatedBy:util.currentUserToken(req).code,
    condemnRequestBy:activeUser
  },
  { code: asset.componentCode },
  txn
);
//UPDATE PARTS INFO END//

            if (insertAssetStatus.error) {
              throw error.message;
            }
          });
        }

        
        assetStatus = { success: true };
        return assetStatus;
    
    } catch (error) {
      // console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};
const partsCondemDirectApproval = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
   
    const { assetsInfo,condemRequestInfo} = req.body;
    let generatedARAForm = condemRequestInfo.araForm;
    let condemnReStatus = 'Approved'
    try {
    
    let CondemnPrefix = "PCHLA"
      let generatedCode = "";
      let type = "PARTS"
     
        let assetStatus = "";
        for (let asset of assetsInfo) {
          assetStatus = await sqlHelper.transact(async (txn) => {
            generatedCode = await sqlHelper.generateUniqueCode(
              "UERMINV..CondemnationHistory",
              `${CondemnPrefix.toUpperCase()}`,
              4,
              txn
            );
            const activeUser = util.currentUserToken(req).code
            const userDeptCode =util.currentUserToken(req).deptCode
            
            let assetsPayload = {
              code: generatedCode,
         requestedDepartment:userDeptCode,
         condemReStatus:condemnReStatus,
         internalAssetCode:asset.internalAssetCode,
        condemRequestedDate:util.currentDateTime(),
        componentCode:asset.componentCode,
        assetCode:asset.assetCode,
              genericName:asset.componentGenericName,
              createdBy: activeUser,
              condemnStatus:true,   
              araForm:generatedARAForm,
              type:type,
              active:true,
              releasedDate:condemRequestInfo.date,
              remarks:condemRequestInfo.remarks
         
            };


            // Insert Asset to the condemn history Table //
            let insertAssetStatus = await assets.insertAssetsCondemn(
              assetsPayload,
              txn
            );
            // Insert Asset to the condemn history Table //
            
// UPDATE PARTS INFO START//
let internalAssetCodeToNull = null
 await assetsComponents.updateAssetsComponents(
  {
    releasedDate:condemRequestInfo.date,
    condemRemarks:condemRequestInfo.remarks,
    // remarks:condemRequestInfo.remarks,
    active:false,
    araForm:generatedARAForm, 
    condemnStatus:true,
    condemnReStatus:condemnReStatus,
    condemnRequestedDate:util.currentDateTime(),
    updatedBy:util.currentUserToken(req).code,
    condemnRequestBy:activeUser,
   
    movedAssetCode:asset.internalAssetCode,
    internalAssetCode:internalAssetCodeToNull
  },
  { code: asset.componentCode },
  txn
);

//UPDATE PARTS INFO END//
            if (insertAssetStatus.error) {
              throw error.message;
            }
          });
        }
        assetStatus = { success: true };
        return assetStatus;
    
    } catch (error) {
      // console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};



//POST INSERT EXCEL DATA
// const postExcelData = async function (req, res) {
//   // if (util.empty(req.body))
//   //   return res.status(400).json({ error: "`body` is required." });
//     const storage = multer.memoryStorage();
//     const upload = multer({ storage: storage });

//     try {
//       if (!req.file) {
//         return res.status(400).json({ success: false});
//       }
//      // Use the 'upload' middleware to process file uploads
//     upload.single('file')(req, res, async function (err) {
//       if (err instanceof multer.MulterError) {
//         // A Multer error occurred during file upload
//         return res.status(400).json({ success: false, message: 'Multer error: ' + err.message });
//       } else if (err) {
//         // An unknown error occurred
//         return res.status(500).json({ success: false, message: 'Internal server error: ' + err.message });
//       }

//       if (!req.file) {
//         // No file provided in the request
//         return res.status(400).json({ success: false, message: 'File not provided.' });
//       }

//       // Convert the buffer data to JSON (assuming it's in JSON format)
//       const jsonData = JSON.parse(req.file.buffer.toString('utf8'));

//       // Save JSON data into SQL Server database using the model
//       const success = await assets.insertExcelData(jsonData);

//       if (success) {
//         return res.status(200).json({ success: true, message: 'File uploaded and saved to the database successfully.' });
//       } else {
//         return res.status(500).json({ success: false, message: 'Failed to save data to the database.' });
//       }
//     });
//   }  catch (error) {
//       // console.log(error);
//       return { error: error };
//     }
 

//   // if (returnValue.error !== undefined) {
//   //   return res.status(500).json({ error: `${returnValue.error}` });
//   // }
//   // return res.json(returnValue);
// };

//currently working 
const postjsonData = async function (req, res) {

  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });
  const returnValue = await sqlHelper.transact(async (txn) => {
    const { nonEmptyRows,departmentCode} = req.body;


    try {
      let assetStatus = "";
      let generatedCode = await sqlHelper.generateUniqueCode(
        "UERMINV..AssetsComponents",
        `A`,
        // `${catCode.toUpperCase()}AC`,
        1,
        txn
      );
      let uploadedBy = "0000" //default to identify lang na inupload existing data from excel

      assetStatus = await sqlHelper.transact(async (txn) => {
       
        for (const jsonData of nonEmptyRows) {
         
        let originMapping = {
          'Purchase Order': '11',
          'Contract': '12',
          'Donation': '13',
          'Audit': '14'
        };
        let classificationMapping = {
          'Computer Equipment': '21',
          'Medical Equipment': '22',
          'Office Equipment': '23',
          'GSD Equipment': '24',
         
          'Engineering Tools and Equipment': '25',
          'Furniture and Fixture': '26',
          // 'Repair Equipment': '27',
          'Books': '28',
          'Instructional Materials': '29'
        };
        // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&*****",)
        if (jsonData['TYPE'] === ' Whole ') {
        let jsonPayload={

          // DeptCode	:jsonData['DeptCode'],
          // Deptname:jsonData['DeptName'],
          // Active:jsonData['Active']
          BrandName	:jsonData['BRAND'],	
          ItemCode:jsonData['ITEM CODE'],
          OldAssetCode:jsonData[' ASSET CODE'],
          Code:generatedCode,	
          // Code:jsonData[' ASSET CODE'],	
// CategoryId	:jsonData.CategoryId,	
CategoryId	:classificationMapping[jsonData['CLASSIFICATION']] || jsonData['CLASSIFICATION'],
DateReceived:	jsonData['PURCHASE/ DONATION DATE'],	
// ReceivingDepartment	:jsonData.ReceivingDepartment,	
ReceivingDepartment	:departmentCode,
// SupplierId	:jsonData.SupplierId,	
SupplierId	:jsonData['SUPPLIER'],	
PONumber	:jsonData.PONumber,	
InvoiceNumber	:jsonData.InvoiceNumber,	
GenericName	:jsonData['GENERIC NAME'],	
Donor	:jsonData['DONOR'],	
Model	:jsonData['MODEL'],	
SerialNumber	:jsonData['SERIAL NO.'],	
Specifications	:jsonData['SPECIFICATIONS'],	
UnitCost	:jsonData['UNIT COST'],	
Status	:jsonData.Status,	
Location	:jsonData['LOCATION'],	
Capitalized	:jsonData['CAPITALIZED'],
TransferredDepartment	:jsonData.TransferredDepartment,	
CreatedBy	:uploadedBy,	
UpdatedBy	:uploadedBy,	
DateTimeUpdated	:util.currentDateTime(),	
Remarks	:jsonData.Remarks,	
// OriginId	:jsonData.OriginId,	
// OriginId: jsonData['ORIGIN'] === 'Purchase Order' ? '11' : jsonData['ORIGIN'],
OriginId: originMapping[jsonData['ORIGIN']] || jsonData['ORIGIN'],
ReceivingReportNo	:jsonData['RR NO.'],	
NetCost	:jsonData['NET UNIT COST'],	
Discount	:jsonData['DISCOUNT'],	
AccountingAssetCode	:jsonData.AccountingAssetCode,	
Administrator:jsonData['ADMINISTRATOR'],
CountedBy	:jsonData['Counted By'],	
AssetTagStatus	:jsonData['ASSET TAG STATUS'],	
AccountingRefNo	:jsonData['ACCOUNTING REFERENCE'],	
ItAssetCode:jsonData['IT ASSET CODE']
         }
       
        // console.log("this is the payloaaaaaad",jsonPayload)
   
    // Insert Asset to the new Assets Table //
    let insertAssetStatus = await assets.insertExcelData(jsonPayload, txn);
    // Insert Asset to the new Assets Table //

    if (insertAssetStatus.error) {
      throw error.message;
    }  } 

   else if (jsonData['TYPE'] === ' Part ') {
    // const catCode = assetComponent.catCode;

    // let classificationMapping = {
    //   'Computer Equipment': 'CE',
    //   'Medical Equipment': '22',
    //   'Office Equipment': '23',
    //   'GSD Equipment': '24',
     
    //   'Engineering Tools and Equipment': '25',
    //   'Furniture and Fixture': '26',
    //   'Repair Equipment': '27',
    //   'Books': '28',
    //   'Instructional Materials': '29'
    // };

   let generatedCode = await sqlHelper.generateUniqueCode(
      "UERMINV..AssetsComponents",
      `AC`,
      // `${catCode.toUpperCase()}AC`,
      1,
      txn
    );



      let jsonPayload={

      
        AssetCode:jsonData['ASSET CODE OF MAIN ITEM'],
        // Code:jsonData['ASSET CODE OF MAIN ITEM'],	
        Code:generatedCode,
        GenericName:jsonData['GENERIC NAME'],
        CreatedBy	:uploadedBy,	
        UpdatedBy	:uploadedBy,	
        DateTimeUpdated	:util.currentDateTime(),	
        
       }
     
   
  // Insert Asset to the component Table //
  let insertAssetStatus = await assetsComponents.insertAssetsComponents(jsonPayload, txn);
  // Insert Asset to the component Table //

  if (insertAssetStatus.error) {
    throw error.message;
  }  } 



  
  } 
    
      });
      assetStatus = { success: true };
      return assetStatus;
    } catch (error) {
      // console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

//CE REGISTRATION
// const postRegisterAssetCE = async function (req, res) {
//   if (util.empty(req.body))
//     return res.status(400).json({ error: "`body` is required." });
//   const returnValue = await sqlHelper.transact(async (txn) => {
//     const { assetsInfo,assetCodeResult,itAssetCodeResult,entries} = req.body;

   
//     try {

//       const numEntries = parseInt(entries);
//       for (let i = 0; i < numEntries; i++) {
//           // console.log(`Processing entry ${i+1}`); 

//       let generatedCode = "";
//       let assetStatus = "";
//       const catCode = "CE";
//       const categoryCoding = '21'
//       const admin = 'IT'
//       // const tagStatus = 'PENDING'

//       assetStatus = await sqlHelper.transact(async (txn) => {
//         generatedCode = await sqlHelper.generateUniqueCode(
//           "UERMINV..Assets",
//           // `${catCode.toUpperCase()}A`,
//            `${catCode}A`,
//           // `A`,
          
//           1,
//           txn
//         );
//         const activeUser = util.currentUserToken(req).code
//         let assetsPayload = {
//           code: generatedCode,

//           oldAssetCode: assetCodeResult,
//           receivingDepartment: assetsInfo.deptCode,
//           // assetTagStatus : tagStatus,
//          itAssetCode:itAssetCodeResult,
//           originId:assetsInfo.originCode,
//           itemCode: assetsInfo.itemCode,
//           categoryId: categoryCoding,
//           dateReceived: assetsInfo.dateReceived,
//           supplierID: assetsInfo.supplierName,
//           receivingReportNo:assetsInfo.receivingReportNo,
//           netCost:assetsInfo.netCost,
//       discount:assetsInfo.discount,
//       administrator:admin,
//       donor:assetsInfo.donor,
//       donationNo:assetsInfo.donationNo,
//       // countedBy:assetsInfo.countedBy,
//       accountingAssetCode:assetsInfo.accountingAssetCode,
//           // poNumber: assetsInfo.purchaseOrderNo,
//           invoiceNumber: assetsInfo.invoiceNo,
//           genericName: assetsInfo.genericName,
//           brandName: assetsInfo.brandName,
//           model: assetsInfo.brandModel,
//           serialNumber: assetsInfo.serialNo,
//           // dateTimeCreated: util.currentDateTime(),
//           // dateTimeUpdated: util.currentDateTime(),
//           specifications: assetsInfo.specifications,
//           unitCost: assetsInfo.unitCost,
//           remarks: assetsInfo.remarks,
//           createdBy: activeUser,
//           location: assetsInfo.physicalLocation,
//         };
//         // console.log("33333 assetsPayload",assetsPayload)

//         // Insert Asset to the new Assets Table //
//         let insertAssetStatus = await assets.insertAssets(assetsPayload, txn);
//         // Insert Asset to the new Assets Table //

//         if (insertAssetStatus.error) {
//           throw error.message;
//         }
//       });
//       assetStatus = { success: true };
//       return assetStatus;
//     } }catch (error) {
//       // console.log(error);
//       return { error: error };
//     }
//   });

//   if (returnValue.error !== undefined) {
//     return res.status(500).json({ error: `${returnValue.error}` });
//   }
//   return res.json(returnValue);
// };



// const postRegisterAssetCE = async function (req, res) {
//   if (util.empty(req.body))
//     return res.status(400).json({ error: "`body` is required." });
//   const { assetsInfo, assetCodeResult, itAssetCodeResult, entries } = req.body;

//   try {
//     const numEntries = parseInt(entries);
// console.log("itAssetCodeResult",itAssetCodeResult)
// console.log("assetsInfo.dateReceived",assetsInfo.dateReceived)
// console.log("numEntries",numEntries)

//     // Start transaction


//     const formatDate = (dateStr) => {
//       const date = new Date(dateStr);
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//       const day = String(date.getDate()).padStart(2, '0');
//       return `${year}${month}${day}`;
//     };
    
//     // Format the date
//     const formattedDate = formatDate(assetsInfo.dateReceived);

//     let test = itAssetCodeResult + formattedDate + numEntries
//     console.log("test",test)

//     const returnValue = await sqlHelper.transact(async (txn) => {
//       for (let i = 0; i < numEntries; i++) {
//         let generatedCode = "";
//         let assetStatus = "";
//         const catCode = "CE";
//         const categoryCoding = '21';
//         const admin = 'IT';

//         // Generate unique code for asset
//         generatedCode = await sqlHelper.generateUniqueCode(
//           "UERMINV..Assets",
//           `${catCode}A`,
//           1,
//           txn
//         );

//         const activeUser = util.currentUserToken(req).code;

//         // Prepare asset payload
//         let assetsPayload = {
//           code: generatedCode,
//           oldAssetCode: assetCodeResult,
//           receivingDepartment: assetsInfo.deptCode,
//           itAssetCode: itAssetCodeResult,
//           originId: assetsInfo.originCode,
//           itemCode: assetsInfo.itemCode,
//           categoryId: categoryCoding,
//           dateReceived: assetsInfo.dateReceived,
//           supplierID: assetsInfo.supplierName,
//           receivingReportNo: assetsInfo.receivingReportNo,
//           netCost: assetsInfo.netCost,
//           discount: assetsInfo.discount,
//           administrator: admin,
//           donor: assetsInfo.donor,
//           donationNo: assetsInfo.donationNo,
//           accountingAssetCode: assetsInfo.accountingAssetCode,
//           invoiceNumber: assetsInfo.invoiceNo,
//           genericName: assetsInfo.genericName,
//           brandName: assetsInfo.brandName,
//           model: assetsInfo.brandModel,
//           serialNumber: assetsInfo.serialNo,
//           specifications: assetsInfo.specifications,
//           unitCost: assetsInfo.unitCost,
//           remarks: assetsInfo.remarks,
//           createdBy: activeUser,
//           location: assetsInfo.physicalLocation,
//         };

//         // Insert Asset to the new Assets Table //
//         let insertAssetStatus = await assets.insertAssets(assetsPayload, txn);

//         if (insertAssetStatus.error) {
//           throw error.message;
//         }
//       }
//       // If all assets inserted successfully, return success
//       return { success: true };
//     });

//     if (returnValue.error !== undefined) {
//       return res.status(500).json({ error: `${returnValue.error}` });
//     }
    
//     // Return success if all assets inserted successfully
//     return res.json({ success: true });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: error });
//   }
// };

const postRegisterAssetCE = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });
  const { assetsInfo, assetCodeResult, itAssetCodeResult, entries } = req.body;

  try {
    const numEntries = parseInt(entries);
// console.log("itAssetCodeResult",itAssetCodeResult)
// console.log("assetsInfo.dateReceived",assetsInfo.dateReceived)
// console.log("numEntries",numEntries)

    // Start transaction


    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };
    
    // Format the date
    const formattedDate = formatDate(assetsInfo.dateReceived);

    

    const returnValue = await sqlHelper.transact(async (txn) => {
      for (let i = 1; i <= numEntries; i++) {
        let itAssetCodeByBatch = `${itAssetCodeResult}-${formattedDate}-${i}/${numEntries}`
    // console.log("itAssetCodeByBatch",itAssetCodeByBatch)
        let generatedCode = "";
        // let assetStatus = "";
        const catCode = "CE";
        const categoryCoding = '21';
        const admin = 'IT';

        // Generate unique code for asset
        generatedCode = await sqlHelper.generateUniqueCode(
          "UERMINV..Assets",
          `${catCode}A`,
          1,
          txn
        );

        const activeUser = util.currentUserToken(req).code;

        // Prepare asset payload
        let assetsPayload = {
          code: generatedCode,
          oldAssetCode: assetCodeResult,
          receivingDepartment: assetsInfo.deptCode,
          itAssetCode: itAssetCodeByBatch,
          originId: assetsInfo.originCode,
          itemCode: assetsInfo.itemCode,
          categoryId: categoryCoding,
          dateReceived: assetsInfo.dateReceived,
          supplierID: assetsInfo.supplierName,
          receivingReportNo: assetsInfo.receivingReportNo,
          netCost: assetsInfo.netCost,
          discount: assetsInfo.discount,
          administrator: admin,
          donor: assetsInfo.donor,
          donationNo: assetsInfo.donationNo,
          accountingAssetCode: assetsInfo.accountingAssetCode,
          invoiceNumber: assetsInfo.invoiceNo,
          genericName: assetsInfo.genericName,
          brandName: assetsInfo.brandName,
          model: assetsInfo.brandModel,
          serialNumber: assetsInfo.serialNo,
          specifications: assetsInfo.specifications,
          unitCost: assetsInfo.unitCost,
          remarks: assetsInfo.remarks,
          createdBy: activeUser,
          location: assetsInfo.physicalLocation,
        };

        // Insert Asset to the new Assets Table //
        let insertAssetStatus = await assets.insertAssets(assetsPayload, txn);

        if (insertAssetStatus.error) {
          throw error.message;
        }
      }
      // If all assets inserted successfully, return success
      return { success: true };
    });

    if (returnValue.error !== undefined) {
      return res.status(500).json({ error: `${returnValue.error}` });
    }
    
    // Return success if all assets inserted successfully
    return res.json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};



const postRegisterAsset = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });
 
    const { assetsInfo ,catCoding,oldAssetCode,entries} = req.body;
  
    // const pref = `${oldAssetCode}-${startNumber}`
    // const startNumberFromPref = parseInt(pref.split('-')[1]);
    try { 
      // let lastAssetCode = oldAssetCode.split('-').pop();
      // const lastPart = ent.split('-').pop();
      const [prefix, category, defaultStartPart, lastPart] = oldAssetCode.split('-');
let lastPartAsInt = parseInt(lastPart, 10)
// let outputs = [];
      const numEntries = parseInt(entries);
      const returnValue = await sqlHelper.transact(async (txn) => {
        // console.log("loop number",numEntries)
        for (let i = 1; i <= numEntries; i++) {
          // console.log("loop number",i)
          // lastPartAsInt += 1;
          const incrementedPart = (lastPartAsInt + i).toString().padStart(4, '0');
  
          const newAssetsCode = `${prefix}-${catCoding.toUpperCase()}-${defaultStartPart}-${incrementedPart}`;
          // outputs.push(output);
      let generatedCode = "";
      // let assetStatus = "";
      const catCode = catCoding;
      // assetStatus = await sqlHelper.transact(async (txn) => {
        generatedCode = await sqlHelper.generateUniqueCode(
          "UERMINV..Assets",
           `${catCode.toUpperCase()}A`,
          // `A`,
          4,
          txn
        );
        const activeUser = util.currentUserToken(req).code
        let assetsPayload = {
          code: generatedCode,
          assetCode: assetsInfo.newAssetCode,
          oldAssetCode: newAssetsCode,
          receivingDepartment: assetsInfo.deptCode,
          assetTagStatus : assetsInfo.assetTagStatus,
         accountingRefNo:assetsInfo.accountingRefNo,
         itAssetCode:assetsInfo.itAssetCode,
          originId:assetsInfo.originCode,
          itemCode: assetsInfo.itemCode,
          categoryId: assetsInfo.categoryCode,
          dateReceived: assetsInfo.dateReceived,
          supplierID: assetsInfo.supplierName,
          receivingReportNo:assetsInfo.receivingReportNo,
          netCost:assetsInfo.netCost,
      discount:assetsInfo.discount,
      administrator:assetsInfo.administrator,
      accountingAssetCode:assetsInfo.accountingAssetCode,
          invoiceNumber: assetsInfo.invoiceNo,
          genericName: assetsInfo.genericName,
          brandName: assetsInfo.brandName,
          model: assetsInfo.brandModel,
          serialNumber: assetsInfo.serialNo,
          specifications: assetsInfo.specifications,
          unitCost: assetsInfo.unitCost,
          remarks: assetsInfo.remarks,
          createdBy: activeUser,
          location: assetsInfo.physicalLocation,
        };
        let insertAssetStatus = await assets.insertAssets(assetsPayload, txn);
// console.log("PAYLOAD",assetsPayload)
        if (insertAssetStatus.error) {
          throw error.message;
        }
      // });






      // assetStatus = { success: true };
      // return assetStatus;
    }
    return { success: true };
  
  });  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json({ success: true });
  // return res.json(returnValue);
} catch (error) {
   // console.log(error);
      return { error: error };
    }

 

};

//UPDATE ASSETS
const putAssets = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const {assetsInfo,itAssetCode,assetCodeResult} = req.body;//assetCodeResult
    // assetCodeResult
   
    try {
      let updateAssetInfo = "";
      // const totalNetCost = (assetsInfo.unitCost - assetsInfo.discount)

  const activeUser = util.currentUserToken(req).code

      updateAssetInfo = await assets.updateAssets(
        {
          
          // dateTimeUpdated: util.currentDateTime(),
          genericName: assetsInfo.genericName,
          assetCode: assetsInfo.assetCode,
          // oldAssetCode: assetsInfo.oldAssetCode,
          oldAssetCode: assetCodeResult,
          receivingDepartment: assetsInfo.deptCode,
          originId:assetsInfo.originCode,
          itemCode: assetsInfo.itemCode,
          categoryId: assetsInfo.categoryId,
          // countedBy: assetsInfo.EmployeeCode,
            countedBy: assetsInfo.countedBy,
            // assetTagStatus:assetsInfo.tagStatus,
            accountingRefNo:assetsInfo.accountingRefNo,
            // itAssetCode:assetsInfo.itAssetCode,
            itAssetCode:itAssetCode,
            assetTagStatus : assetsInfo.assetTagStatus,
          dateReceived: assetsInfo.dateReceived,
          // supplierName: assetsInfo.supplierName,
          supplierId: assetsInfo.supplierId,
          // poNumber: assetsInfo.poNumber,
          // invoiceNumber: assetsInfo.invoiceNumber,
          receivingReportNo:assetsInfo.receivingReportNo,
          netCost:assetsInfo.netCost,
          // netCost:totalNetCost,
      discount:assetsInfo.discount,
      location: assetsInfo.location,
      // countedBy:assetsInfo.countedBy,
      accountingAssetCode:assetsInfo.accountingAssetCode,
          brandName: assetsInfo.brandName,
          unitCost: assetsInfo.unitCost,
          model: assetsInfo.model,
          serialNumber: assetsInfo.serialNumber,
          updatedBy: activeUser,
          specifications: assetsInfo.specifications,
          remarks: assetsInfo.remarks,
          administrator:assetsInfo.administrator,
          donationNo:assetsInfo.donationNo,
          donor:assetsInfo.donor,
          capitalized:assetsInfo.capitalized
          
        },
        { code: assetsInfo.code }, //where clause
        txn
      );

// UPDATE PARTS INFO START//
await assetsComponents.updateAssetsComponents(
  {
    receivingDepartment: assetsInfo.deptCode,
    // assetCode: assetsInfo.oldAssetCode,  
    assetCode: assetCodeResult,
    administrator:assetsInfo.administrator,
    categoryId:assetsInfo.categoryId,
    physicalLocation:assetsInfo.physicalLocation
 
  },
  { internalAssetCode: assetsInfo.code },
  txn
);
//UPDATE PARTS INFO END//



      return res.status(200).json(updateAssetInfo);
      //  return res.status(200).json({ success: true, message: "Update successful." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error. this is catch" });
    }
  });
  return returnValue;
};

//assigning of asset code mga CE na wala pang assetcode
const putAssignAssetCodeCE = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const {assetsInfo,assetCodeResult} = req.body;
    try {
      let updateAssetInfo = "";

  const activeUser = util.currentUserToken(req).code

      updateAssetInfo = await assets.updateAssets(
        {
          
          // dateTimeUpdated: util.currentDateTime(),
          oldAssetCode: assetCodeResult,
          updatedBy: activeUser,
          
        },
        { code: assetsInfo.code }, //where clause
        txn
      );

// UPDATE PARTS INFO START//
await assetsComponents.updateAssetsComponents(
  {
    receivingDepartment: assetsInfo.deptCode,
    // assetCode: assetsInfo.oldAssetCode,
    assetCode:assetCodeResult
 
  },
  { internalAssetCode: assetsInfo.code },
  txn
);
//UPDATE PARTS INFO END//



      return res.status(200).json(updateAssetInfo);
      //  return res.status(200).json({ success: true, message: "Update successful." });
    } catch (error) {
      // console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error. this is catch" });
    }
  });
  return returnValue;
};




//APPROVAL TRANSFER REQUEST WHOLE
const putAssetsTransfer = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const {assetsInfo,assetTransferInfo,assetComponents} = req.body;
    let updateAssetInfo = "";
    let transferReStatus="Approved"
    let transferReStatusParts="Approved(with whole)"
    let itemType="WHOLE"
   
    try {
  for (let asset of assetsInfo) {
    let assetStatus = "";
    assetStatus = await sqlHelper.transact(async (txn) => {
      const activeUser = util.currentUserToken(req).code
      let transferReStatus="Approved"
      let prefixs="TFA"
   let generatedCode = await sqlHelper.generateUniqueCode(
        "UERMINV..AssetAllotmentHistory",
        prefixs.toUpperCase(),
        4,
        txn
      );
      let assetsPayload = {
        code: generatedCode,
        internalAssetCode:asset.code,
        assetCode:asset.oldAssetCode,
   fromDeptCode:asset.receivingDepartment,
   toDeptCode:asset.transferredDepartment ,
   transferFormNo:asset.transferFormNo, 
   genericName:asset.genericName,
   transferReStatus:transferReStatus,
        updatedBy: activeUser,
        createdBy: activeUser,
        transferStatus:false,
        // remarks:remarks,
        transferringRequestedDate:asset.transferRequestedDate,
        type:itemType
      };
      // console.log("assetsPayload",assetsPayload)
     await assets.insertAssetsTransfer(
        assetsPayload,
        txn
      );})

      updateAssetInfo = await assets.updateAssets(
        {
          receivingDepartment: asset.transferredDepartment,
          active:true,
          transferStatus:true,
          transferReStatus:transferReStatus 
        },
        { transferFormNo: assetTransferInfo.transferFormNo }, //where clause
        txn
      );
   
await assetsComponents.updateAssetsComponents(
  {
    receivingDepartment: asset.transferredDepartment,
    transferStatus:true,
    active:true,
    transferReStatus:transferReStatusParts
 
  },
  { transferFormNo: assetTransferInfo.transferFormNo },
  txn
);
    }


// for (let asset of assetsInfo) {   
//       updateAssetInfo = await assets.updateAssets(
//         {
//           receivingDepartment: asset.transferredDepartment,
//           active:true,
//           transferStatus:true,
//           transferReStatus:transferReStatus 
//         },
//         { transferFormNo: assetTransferInfo.transferFormNo }, //where clause
//         txn
//       );
   
// await assetsComponents.updateAssetsComponents(
//   {
//     receivingDepartment: asset.transferredDepartment,
//     transferStatus:true,
//     active:true,
//     transferReStatus:transferReStatusParts
 
//   },
//   { transferFormNo: assetTransferInfo.transferFormNo },
//   txn
// ); }


let itemTypes="PARTS"
let codePrefix="P"
for (let parts of assetComponents) {
  let assetStatus = "";
  assetStatus = await sqlHelper.transact(async (txn) => {
    const activeUser = util.currentUserToken(req).code
   let generatedCode = await sqlHelper.generateUniqueCode(
      "UERMINV..AssetsComponents",
      codePrefix.toUpperCase(),
      4,
      txn
    );
    let partsPayload = {
      code: generatedCode,
      assetCode:parts.componentAssetCode,
 fromDeptCode:parts.receivingDepartment,
toDeptCode:parts.transferredDepartment,
 transferReStatus: transferReStatusParts,
 genericName:parts.componentGenericName,
 internalAssetCode:parts.internalAssetCode,
 transferFormNo:parts.transferFormNo, 
      updatedBy: activeUser,
      createdBy: activeUser,
      transferStatus:false,
      // remarks:remarks,
      type:itemTypes,
      transferringRequestedDate:parts.transferRequestedDate,
      componentCode:parts.componentCode,
    };
    // console.log("Parts",partsPayload)

    let insertAssetStatus = await assets.insertAssetsTransfer(
      partsPayload,
      txn
    );

    if (insertAssetStatus.error) {
      throw error.message;
    }
  });
}
      return res.status(200).json(updateAssetInfo);
      //  return res.status(200).json({ success: true, message: "Update successful." });
    } catch (error) {
      // console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error. this is catch" });
    }
  });
  return returnValue;
};


//APPROVAL TRANSFER REQUEST PARTS
const putAssetsTransferParts = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const { assetsInfo,partsTransferInfo,assetCode } = req.body;
    const activeUser = util.currentUserToken(req).code
    let assetCodeMain = assetCode.transferingAssetCode;
    let itemType = 'PARTS'
    let prefixs="PAHLA"
 
    try {
    
//       let transferReStatusParts="Approved"

// let assetsPayload = {
//   code: generatedCode,
//   assetCode:assetsInfo.componentAssetCode,
// fromDeptCode:assetsInfo.receivingDepartment,
// toDeptCode:assetsInfo.transferredDepartment,
// transferFormNo:assetsInfo.transferFormNo, 
//   updatedBy: activeUser,
//   createdBy:activeUser,
//   transferReStatus:transferReStatusParts,
//   transferStatus:true,
//   // remarks:remarks,
//   tranferringAssetCode:assetsInfo.transferingAssetCode,
//   transferringRequestedDate:assetsInfo.transferRequestedDate,
//   genericName:assetsInfo.componentGenericName,
//   internalAssetCode:assetsInfo.internalAssetCode,
//   componentCode:assetsInfo.componentCode,
//   type:itemType
// };
// console.log("TEST",assetsPayload)

// await assets.insertAssetsTransfer(
//   assetsPayload,
//   txn
// );
let transferReStatusParts="Approved"
for (let parts of assetsInfo) {
  let assetStatus = "";
  assetStatus = await sqlHelper.transact(async (txn) => {
    const activeUser = util.currentUserToken(req).code
   let generatedCode = await sqlHelper.generateUniqueCode(
      "UERMINV..AssetAllotmentHistory",
      prefixs.toUpperCase(),
      2,
      txn
    );
    let partsPayload = {
      code: generatedCode,
      assetCode:parts.componentAssetCode,
 fromDeptCode:parts.receivingDepartment,
// toDeptCode:parts.transferredDepartment,
 transferReStatus: transferReStatusParts,
 genericName:parts.componentGenericName,
 internalAssetCode:parts.internalAssetCode,
 transferFormNo:parts.transferFormNo, 
 tranferringAssetCode:parts.transferingAssetCode,
      updatedBy: activeUser,
      createdBy: activeUser,
      transferStatus:true,
      type:itemType,
      transferringRequestedDate:parts.transferRequestedDate,
      componentCode:parts.componentCode,
    };
    // console.log("Parts",partsPayload)

    let insertAssetStatus = await assets.insertAssetsTransfer(
      partsPayload,
      txn
    );

    if (insertAssetStatus.error) {
      throw error.message;
    }
  });}




      let sqlWhere = "AND oldAssetCode = ?";
      let transferReStatus = "Approved"
      let args = [assetCodeMain];
      let options = {
        top: "",
        order: "dateTimeUpdated DESC",
      };
      const existingAssets = await assets.selectAssets(sqlWhere, args, options, txn);


      if (existingAssets && existingAssets.length > 0) {
        const oldAsset = existingAssets[0]; 
        const oldAssetCode = oldAsset.code; 
        const deptPartment = oldAsset.receivingDepartment; 

          // Asset code exists, proceed with the update
        const updateAssetInfo = await assetsComponents.updateAssetsComponents(
          {
            // receivingDepartment: assetsInfo.transferredDepartment,
            receivingDepartment:deptPartment,
            transferStatus: true,
            active: true,
            transferReStatus:transferReStatus,
            assetCode: assetCode.transferingAssetCode,
            internalAssetCode: oldAssetCode, 
            updatedBy:activeUser
          },
          { transferFormNo: partsTransferInfo.transferFormNo },
          txn
        );

        return res.status(200).json(updateAssetInfo);
      } else {
        
        return res.status(404).json({ error: "Asset code not found TEST." });
      }
    } catch (error) {

      console.error(error);
      return res.status(500).json({ error: "Internal server error." });
    }
  });
  return returnValue;
};






//cancel transfer request asset mweee by department ang gumagamit
const putAssetsCancelTransfer = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const {assetsInfo,asstInfs,parts} = req.body;
    // console.log("@@@@ ", parts)
    // console.log("@@@@ ",asstInfs)
    let tranferFormUpdate = "Canceled"
    let tranferFormUpdateq = ""
    let itemType ="WHOLE"
    try {
      let updateAssetInfo = "";

      const activeUser = util.currentUserToken(req).code
      for (let asstInf of asstInfs) {
const prefixs = "WAHLC"
        let generatedCode = await sqlHelper.generateUniqueCode(
          "UERMINV..AssetAllotmentHistory",
          prefixs.toUpperCase(),
          2,
          txn
        );
      let assetsPayload = {
        code: generatedCode,
        assetCode:asstInf.oldAssetCode,
   fromDeptCode:asstInf.receivingDepartment,
   toDeptCode:asstInf.transferredDepartment,
   transferFormNo:asstInf.transferFormNo, 
   genericName:asstInf.genericName,
   transferReStatus:tranferFormUpdate,
        transferringRequestedDate:asstInf.transferRequestedDate,
        createdBy: activeUser,
        transferStatus:false,
        // remarks:remarks,
        type:itemType,
        internalAssetCode:asstInf.code
      };
      // console.log("assetsPayload ########",assetsPayload);

      // Insert Asset to the new Assets Table //
      await assets.insertAssetsTransfer(
        assetsPayload,
        txn
      );
    }
      updateAssetInfo = await assets.updateAssets(
        {
          
          // dateTimeUpdated: util.currentDateTime(),
updatedBy:util.currentUserToken(req).code,
          active:true,
          transferStatus:true,
          transferReStatus:tranferFormUpdate,
          cancelStatus:true,
          transferFormNo:tranferFormUpdateq
          
        },
        { transferFormNo: assetsInfo.transferFormNo }, //where clause
        txn
      );


      // UPDATE PARTS INFO START//
await assetsComponents.updateAssetsComponents(
  {
   
    transferStatus:true,
    transferReStatus:tranferFormUpdate,
    cancelStatus:true,
    active:true,
    transferFormNo:tranferFormUpdateq
    
 
  },
  { transferFormNo: assetsInfo.transferFormNo },
  txn
);
//UPDATE PARTS INFO END//
for (let asstInf of parts) {
  const prefixs = "PAHLC"
  let generatedCode = await sqlHelper.generateUniqueCode(
    "UERMINV..AssetAllotmentHistory",
    prefixs.toUpperCase(),
    2,
    txn
  );
  let itemTypes="PARTS"
  let assetsPayload = {
    code: generatedCode,
    assetCode:asstInf.componentAssetCode,
fromDeptCode:asstInf.receivingDepartment,
toDeptCode:asstInf.transferredDepartment,
transferFormNo:asstInf.transferFormNo, 
genericName:asstInf.componentGenericName,
transferReStatus:tranferFormUpdate,
    transferringRequestedDate:asstInf.transferRequestedDate,
    createdBy: activeUser,
    transferStatus:false,
    type:itemTypes,
    internalAssetCode:asstInf.internalAssetCode,
    componentCode:asstInf.componentCode
  };
// console.log("assetsPayload",assetsPayload)
  await assets.insertAssetsTransfer(
    assetsPayload,
    txn
  );

}
      return res.status(200).json(updateAssetInfo);


      
      //  return res.status(200).json({ success: true, message: "Update successful." });
    } catch (error) {
      // console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error. this is catch" });
    }
  });
  return returnValue;
};

//cancel whole condemn by department
const putAssetsCancelCondemn = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const {assetsInfo,parts,assetsDetails} = req.body;
    let condemnReStatus = "Canceled"
    try {
      let updateAssetInfo = "";
      // const activeUsera = util.currentUserToken(req).deptCode
      let CondemnPrefixAsset = "WCHLC"
      let typesWhole = "WHOLE"
      for (let asset of assetsDetails) {
        let generatedCode = "";
        let assetStatus = "";
        assetStatus = await sqlHelper.transact(async (txn) => {
          generatedCode = await sqlHelper.generateUniqueCode(
            "UERMINV..CondemnationHistory",
            `${CondemnPrefixAsset.toUpperCase()}`,
            4,
            txn
          );
          const activeUser = util.currentUserToken(req).code
          
          let assetsPayload = {
            code: generatedCode,
            assetCode:asset.oldAssetCode,
       requestedDepartment:asset.receivingDepartment,
       condemReStatus:condemnReStatus,
       internalAssetCode:asset.code,
      condemRequestedDate:asset.condemRequestedDate,
            genericName:asset.genericName,
            createdBy: activeUser,
            condemnStatus:false,     
            araForm:asset.araForm,
            type:typesWhole,
            active:false
          };
      
          let insertAssetStatus = await assets.insertAssetsCondemn(
            assetsPayload,
            txn
          );
      
      
          if (insertAssetStatus.error) {
            throw error.message;
          }
        });
      
      
      }
      
      let CondemnPrefix = "PCHLC"
      let types = "PARTS"
    
      
for (let part of parts) {
  let assetStatus = "";
  let generatedCode = "";
  assetStatus = await sqlHelper.transact(async (txn) => {
    generatedCode = await sqlHelper.generateUniqueCode(
      "UERMINV..CondemnationHistory",
      `${CondemnPrefix.toUpperCase()}`,
      4,
      txn
    );
    const activeUser = util.currentUserToken(req).code
    
    let assetsPayload = {
      code: generatedCode,
      assetCode:part.assetCode,
 requestedDepartment:part.receivingDepartment,
 condemReStatus:condemnReStatus,
 internalAssetCode:part.movedAssetCode,
condemRequestedDate:part.condemnRequestedDate,
componentCode:part.componentCode,
assetCode:part.assetCode,
      genericName:part.componentGenericName,
      createdBy: activeUser,
      condemnStatus:false,     
      araForm:part.araForm,
      type:types,
      active:false
    };

    let insertAssetStatus = await assets.insertAssetsCondemn(
      assetsPayload,
      txn
    );


    if (insertAssetStatus.error) {
      throw error.message;
    }
  });


}




      updateAssetInfo = await assets.updateAssets(
        {
          
          // dateTimeUpdated: util.currentDateTime(),
updatedBy:util.currentUserToken(req).code,
          active:true,
          condemnStatus:true,
          condemnReStatus:condemnReStatus,
          // araForm:tranferFormUpdate,
          cancelStatus:true
          
        },
        {araForm: assetsInfo.araForm}, //where clause
        txn
      );

await assetsComponents.updateAssetsComponents(
  {
   
    condemnStatus:true,
    // araForm:tranferFormUpdate,
    condemnReStatus:condemnReStatus,
    active:true
 
  },
  {araForm: assetsInfo.araForm},
  txn
);

      return res.status(200).json(updateAssetInfo);


      
      //  return res.status(200).json({ success: true, message: "Update successful." });
    } catch (error) {
      // console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error. this is catch" });
    }
  });
  return returnValue;
};


//cancel parts condemn by property
const putPartsCancelCondemn = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const {assetsInfo,parts} = req.body;
    let condemnReStatus = "Cancelled"
    try {
      let CondemnPrefix = "PCHLC"
      let generatedCode = "";
      let types = "PARTS"
    
      let assetStatus = "";
for (let asset of parts) {
  assetStatus = await sqlHelper.transact(async (txn) => {
    generatedCode = await sqlHelper.generateUniqueCode(
      "UERMINV..CondemnationHistory",
      `${CondemnPrefix.toUpperCase()}`,
      4,
      txn
    );
    const activeUser = util.currentUserToken(req).code
    
    let assetsPayload = {
      code: generatedCode,
      assetCode:asset.oldAssetCode,
 requestedDepartment:asset.receivingDepartment,
 condemReStatus:condemnReStatus,
 internalAssetCode:asset.componentAssetCode,
condemRequestedDate:asset.condemnRequestedDate,
componentCode:asset.componentCode,
assetCode:asset.assetCode,
      genericName:asset.componentGenericName,
      createdBy: activeUser,
      condemnStatus:false,     
      araForm:asset.araForm,
      type:types,
      active:false
    };

    let insertAssetStatus = await assets.insertAssetsCondemn(
      assetsPayload,
      txn
    );


    if (insertAssetStatus.error) {
      throw error.message;
    }
  });


}
let updateAssetInfo = "";
let tranferFormUpdate =  null;
for (let part of parts) {
updateAssetInfo = await assetsComponents.updateAssetsComponents(
{
// condemnStatus:true,
araForm:tranferFormUpdate,
condemnReStatus:condemnReStatus,
active:true,
// internalAssetCode:part.movedAssetCode,
// updatedBy:util.currentUserToken(req).code

},

{ code: part.componentCode },
txn
); }

      return res.status(200).json(updateAssetInfo);
      //  return res.status(200).json({ success: true, message: "Update successful." });
    } catch (error) {
      // console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error. this is catch" });
    }
  });
  // if (returnValue.error !== undefined) {
  //   return res.status(500).json({ error: `${returnValue.error}` });
  // }
  return returnValue;
};





const putAssetsTransferLocation = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const {assetsInfo} = req.body;

    try {
      let updateAssetInfo = "";
  // const activeUser = util.currentUserToken(req).code

      updateAssetInfo = await assets.updateAssets(
        {
          
          // dateTimeUpdated: util.currentDateTime(),
    
          location:assetsInfo.location,
          updatedBy:util.currentUserToken(req).code
          
        },
        { code: assetsInfo.code }, //where clause
        txn
      );
// UPDATE PARTS INFO START//
await assetsComponents.updateAssetsComponents(
  {
    location:assetsInfo.location,
    updatedBy:util.currentUserToken(req).code
 
  },
  { internalAssetCode: assetsInfo.code },
  txn
);
//UPDATE PARTS INFO END//



      return res.status(200).json(updateAssetInfo);
      //  return res.status(200).json({ success: true, message: "Update successful." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error. this is catch" });
    }
  });
  return returnValue;
};



//testing can be remove
const getAssetsTesting = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    // const activeUser = util.currentUserToken(req).code
    // console.log("*********************************", activeUser)
  
    // const token = util.currentUserToken(req);

    // const activeUser = token.user.deptCode;
    // console.log("tOOOOOOOOOOOOOOOOOOOOOOOOOOOKEN",token); 
    // console.log("tOOOOOOOOOOOOOOOOOOOOOOOOOOOKEN",activeUser); 
    let args = [];
    sqlWhere = `and active = ?`;
    args = [1];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
    };
    return await assets.selectAssetsTesting(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};


module.exports = {
  getAssets,
  getOldAssets,
  putAssets,
  putAssignAssetCodeCE,
  postRegisterAsset,
  postAssets,
  postjsonData,
  getAssetsTesting,
  postAssetsTransfer,
  getAssetsPendingTransfers,
  getAssetsByDepartment,
  getAssetsApprovalTransfers,
  putAssetsTransfer,
  postAssetsCondemn,
  getAssetsCondemnTransfer,
  getAssetsCondemnApproval,
  putAssetsTransferLocation,
  postAssetsCondemnApproved,
  getCEApprovalTransfers,
  getAssetsCE,
  postRegisterAssetCE,
  putAssetsCancelTransfer,
  postAssetsTransferChangeDepartment,
  postPartsTransfer,

  getCEApprovalTransfersParts,
  putAssetsTransferParts,
  getSearchCode,
  getPartsApprovalTransfers,
  putAssetsCancelCondemn,
  getPartsCondemnTransfer ,
  postSendCondemnRequestParts,
  getPartsCondemnForApproval,
  putPartsCancelCondemn,
  postPartsCondemnApproved,
  getSearcAssetCode,
  getAssetsCEnoAssetCode,
  getRetiredCEWholeAsset,
  getAllRetiredWholeAsset,
  getRetiredCEParts,
  getAssetsActive,
  getPartsActive,
  getActiveEquipmentWhole,
  getDistinctTransferFormNo,
  getAssetToTransfer,
  getDistinctTransferFormNoParts,
  getPartsToTransfer,
  getDistinctAraFormNo,
  getAssetToCondemn,
  getDistinctApprovalTransferFormNo,
  getAssetToTransferProperty,
  getAssetToTransferIT,
  getCEDistinctApprovalTransferFormNo,
  getDistinctTransferFormNoPartsIT,
  getDistinctTransferFormNoPartsProperty,
  getPartsToTransferProperty,
  getDistinctAraFormNoByProperty,
  getCondemnListProperty,
  getDistinctAraFormByDeptParts,
  getPartsToTCondemnByDept,
  getSearcITAssetCode,
  getPartsToTransferITEquip,
  getApprovedAssetLogs,
  getAssetsByPassCondem,
  condemDirectApproval,
  partsCondemDirectApproval,
  getAllRetiredWholeAssetDepartment,
  getUpcomingCondemRequest,
  getUpcomingPartsCondemRequest
  // convertME
};