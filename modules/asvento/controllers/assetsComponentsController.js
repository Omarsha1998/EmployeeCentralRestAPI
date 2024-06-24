const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

const assetsComponents = require("../models/assetsComponents.js");
const assets = require("../models/assets.js");
const allotmentHistory  = require("../models/allotmentHistory.js");

const getCurrentAssignedComponents = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.code))
      return res.status(400).json({ error: "`Asset Codessss` is required." });

    let code = req.query.code;
// let condemStat = 'Approved'
    let sqlWhere = "";
    let args = [];
    sqlWhere = `and asstCompo.active= ? and asstCompo.internalAssetCode = ?`;
    args = [1, code];

    let options = {
      top: "",
      order: "",
    };
    return await assetsComponents.selectAssignedComponents(
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

const getComponentParts = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.code))
      return res.status(400).json({ error: "`Asset Codessss` is required." });

    let code = req.query.code;
let condemStat = 'Approved'
    let sqlWhere = "";
    let args = [];
    sqlWhere = `and asstCompo.condemnReStatus <>? and asstCompo.internalAssetCode = ?`;
    args = [condemStat, code];

    let options = {
      top: "",
      order: "",
    };
    return await assetsComponents.selectAssignedComponents(
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

const getPartsLogApproved = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let code = req.query.code;
    if (util.empty(req.query.code))
    return res.status(400).json({ error: "`Code` is required." });
    let sqlWhere = "";
    let equipType = "PARTS"
    let transferStatus = "Approved"
    let args = [];
    sqlWhere = `and active = ?  and transferReStatus=? and internalAssetCode=?`;
    args = [1,transferStatus,code];
    let options = {
      top: "",
      order: "",
    };
    return await assetsComponents.selectAllParts(sqlWhere, args, options, txn);
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const getRetiredPartsAll = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
  
let condemnReStatus='Approved'

    let sqlWhere = "";
    let args = [];
    sqlWhere = `and asstCompo.active = ? and asstCompo.condemnReStatus = ?`;
    args = [0, condemnReStatus];
    let options = {
      top: "",
      order: "dateTimeUpdated desc ",
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

const getIncludedPartsToTransfer = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.code))
      return res.status(400).json({ error: "`Asset Codessss getIncludedPartsToTransfer` is required." });

    let code = req.query.code;
    let transferStat='Pending(with Whole)'
    let sqlWhere = "";
    let args = [];
    sqlWhere = `and asstCompo.active = ? and asstCompo.internalAssetCode = ? and asstCompo.transferReStatus = ?`;
    args = [0, code,transferStat];
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

const getAllParts= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    // let assetCode = req.query.assetCode;
     let userDeptCode = util.currentUserToken(req).deptCode
     let sqlWhere = "";
    let args = [];
    sqlWhere = `and active = ? and receivingDepartment = ?`;
    args = [1,userDeptCode];

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

const getAllCEParts= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    // let assetCode = req.query.assetCode;
    //  let userDeptCode = util.currentUserToken(req).deptCode
     let sqlWhere = "";
     const administrator ="IT"
    let args = [];
    sqlWhere = `and active = ? and administrator = ?`;
    args = [1,administrator];

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
    
  }

);
// console.log("CHECH+K ",returnValue)
  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};
const getAllPartsByPassCondem= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    // let assetCode = req.query.assetCode;
     let sqlWhere = "";
    let args = [];
    sqlWhere = `and active = ?`;
    args = [1];

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

const getPartsActiveInactive= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    // let assetCode = req.query.assetCode;
     let userDeptCode = util.currentUserToken(req).deptCode
     let sqlWhere = "";
    let args = [];
    sqlWhere = ` `;
    args = [];

    // if (!util.empty(req.query.assetCode)) {
      args = [req.query.assetCode,req.query.assetCode]
      sqlWhere = 'and movedAssetCode = ? or internalAssetCode =?'
    // }

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

const getPartsByAssetCode= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
  
     let sqlWhere = "";
    let args = [];
    sqlWhere = ` `;
    args = [];

    if (!util.empty(req.query.assetCode)) {
      args = [req.query.assetCode]
      sqlWhere = 'and internalAssetCode =?'
    }

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

// const getPartsActiveOnly= async function (req, res) {
//   const returnValue = await sqlHelper.transact(async (txn) => {
    

//     let assetCodes = req.query.assetCode;
//   let userDeptCode = util.currentUserToken(req).deptCode
//       let sqlWhere = "";
//     if (!Array.isArray(assetCodes)) {
//       assetCodes = [assetCodes];
//     }
      
//     for (let assetCode of assetCodes) {
  
//      let args = [];
//      sqlWhere = `and receivingDepartment = ? and active = ? and internalAssetCode = ?`;
//      args = [userDeptCode,1,assetCode];
    

//     let options = {
//       top: "",
//       order: "",
//     };
//     return await assetsComponents.selectAllParts(
//       sqlWhere,
//       args,
//       options,
//       txn
//     );
//        }
//   });

//   if (returnValue.error !== undefined) {
//     return res.status(500).json({ error: `${returnValue.error}` });
//   }
//   return res.json(returnValue);
// };

// const getPartsActiveOnly= async function (req, res) {
//   const returnValue = await sqlHelper.transact(async (txn) => {

//      let userDeptCode = util.currentUserToken(req).deptCode
//      let sqlWhere = "";
//     let args = [];
   
//  let assetCodes = req.query.assetCode;

//  if (!Array.isArray(assetCodes)) {
//   // If it's not an array, make it an array with one element
//   assetCodes = [assetCodes];
// }
// for (let loopParts of assetCodes) {
//       console.log("assetCode############################",loopParts)
//       sqlWhere = `and receivingDepartment = ? and active = ? `;
//     args = [userDeptCode,1];

   
//     if (!util.empty(loopParts)) {
//       args = [loopParts]
//       sqlWhere = 'and internalAssetCode = ?'
//     }
     
//     let options = {
//       top: "",
//       order: "",
//     };
//     return await assetsComponents.selectAllParts(
//       sqlWhere,
//       args,
//       options,
//       txn
//     );
//     }
    


//   });

//   if (returnValue.error !== undefined) {
//     return res.status(500).json({ error: `${returnValue.error}` });
//   }
//   return res.json(returnValue);
// };


const getPartsActiveOnly = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    // let userDeptCode = util.currentUserToken(req).deptCode;
    let sqlWhere = "";
    let args = [];
   
    let assetCodes = req.query.assetCode;

    if (!Array.isArray(assetCodes)) {
      assetCodes = [assetCodes];
    }

    let allParts = [];

    for (let loopParts of assetCodes) {
      sqlWhere = `and active = ? and internalAssetCode = ?`;
      args = [1, loopParts];

      let options = {
        top: "",
        order: "",
      };

      let parts = await assetsComponents.selectAllParts(
        sqlWhere,
        args,
        options,
        txn
      );

      if (parts.error !== undefined) {
        return { error: parts.error };
      }

      allParts = allParts.concat(parts); // Combine results
    }

    return allParts;
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};



const getPartsInactive= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    
    // let assetCode = req.query.assetCode;

     let userDeptCode = util.currentUserToken(req).deptCode
     let sqlWhere = "";
     let reStatus = "Pending(by parts)"
    let args = [];
    sqlWhere = `and receivingDepartment = ? and transferRestatus<>?`;
    args = [userDeptCode,reStatus];

    if (!util.empty(req.query.assetCode)) {
      args = [req.query.assetCode]
      sqlWhere = 'and internalAssetCode = ?'
    }

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

const getIncludedPartsInformationReview= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {

     let userDeptCode = util.currentUserToken(req).deptCode
     let sqlWhere = "";
     let reStatus = "Pending(by parts)"
    let args = [];
    sqlWhere = `and receivingDepartment = ? and transferRestatus<>?  `;
    args = [userDeptCode,reStatus];

    if (!util.empty(req.query.assetCode)) {
      args = [req.query.assetCode]
      sqlWhere = 'and transferFormNo = ?'
    }

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

const getPendingCondemParts= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {

     let userDeptCode = util.currentUserToken(req).deptCode
     let sqlWhere = "";
     let reStatus = "Pending(with whole)"
    let args = [];
    sqlWhere = `and receivingDepartment = ? and condemnRestatus=? and condemnStatus <> ?`;
    args = [userDeptCode,reStatus,1];

    if (!util.empty(req.query.araForm)) {
      args = [req.query.araForm]
      sqlWhere = 'and araForm = ?'
    }

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

const getIncludedPartsWithWhole= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {

     let userDeptCode = util.currentUserToken(req).deptCode
     let sqlWhere = "";
     let reStatus = "Pending(by parts)"
    let args = [];


    let assetCodes = req.query.assetCode;

    if (!Array.isArray(assetCodes)) {
      assetCodes = [assetCodes];
    }
    let allParts = [];
    for (let loopParts of assetCodes) {
      sqlWhere = `and receivingDepartment = ? and transferRestatus<>?  and internalAssetCode = ?`;
    args = [userDeptCode,reStatus,loopParts];
    let options = {
      top: "",
      order: "",
    };
    let parts= await assetsComponents.selectAllParts(
      sqlWhere,
      args,
      options,
      txn
    );
    if (parts.error !== undefined) {
      return { error: parts.error };
    }

    allParts = allParts.concat(parts); // Combine results

    }
    return allParts;


    // if (!util.empty(req.query.assetCode)) {
    //   args = [req.query.assetCode]
    //   sqlWhere = 'and internalAssetCode = ?'
    // }

   
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const getPartsActiveInactiveNoDeptLimit= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    
     let sqlWhere = "";
    let args = [];
    sqlWhere = ` `;
    args = [];

    if (!util.empty(req.query.transferFormNo)) {
      args = [req.query.transferFormNo]
      sqlWhere = 'and transferFormNo = ?'
    }


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

const getPartsTransferPrint= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.code))
      return res.status(400).json({ error: "`ASset Code ` is required." });

    let code = req.query.code;
    let transferStat='Pending(with Whole)'
    let sqlWhere = "";
    let args = [];
    sqlWhere = `and asstCompo.active = ? and asstCompo.internalAssetCode = ? and asstCompo.transferReStatus = ?`;
    args = [0, code,transferStat];
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


const getCondemLogInfo = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    let sqlWhere = "";
    let internalAssetCode = req.query.code;
    // console.log("internalAssetCode",internalAssetCode)
    let types ="PARTS"
    let condemReStatus = "APPROVED"
    // let condemnReStatus ='Approved'
    let args = [];
    sqlWhere = `and asstCompo.code=? and condemLog.type=? and condemLog.condemReStatus=? `;
    args = [internalAssetCode,types,condemReStatus ];
    let options = {
      top: "",
      order: "asstCompo.dateTimeUpdated desc ",
    };
    return await assetsComponents.selectAllPartsDeCondemDepart(sqlWhere, args, options, txn);
  });
  // console.log("testdsfgsdg@@@@@@@@@@@@@@@@@@@",returnValue)

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};


const getPartsApprovedPartsWithMainAsset= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.code))
    return res.status(400).json({ error: "`Asset Code` is required." });

  let internalAssetCode = req.query.code;
  let araForm = req.query.araForm;
    const condemnReStatus = 'Approved(with whole)'
     let sqlWhere = "";
    let args = [];
    sqlWhere = `and condemnReStatus=? and active =? and internalAssetCode = ?  and araForm = ?`;
    args = [condemnReStatus,0,internalAssetCode,araForm];

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

// const getCondemLogParts= async function (req, res) {
//   const returnValue = await sqlHelper.transact(async (txn) => {
//     if (util.empty(req.query.code))
//     return res.status(400).json({ error: "`Component Code` is required." });

//   const componentCode = req.query.code;

//     const condemnReStatus = 'Approved'
//     const types = 'PARTS'
//      let sqlWhere = "";
//     let args = [];
//     sqlWhere = `and condemReStatus=?  and componentCode = ?  and type = ?`;
//     args = [condemnReStatus,componentCode,types];

//     let options = {
//       top: "",
//       order: "",
//     };
//     return await allotmentHistory.selectCondemHistory(
//       sqlWhere,
//       args,
//       options,
//       txn
//     );
//   });

//   if (returnValue.error !== undefined) {
//     return res.status(500).json({ error: `${returnValue.error}` });
//   }
//   return res.json(returnValue);
// };
// const getCondemLogAssets= async function (req, res) {
//   const returnValue = await sqlHelper.transact(async (txn) => {
//     if (util.empty(req.query.code))
//     return res.status(400).json({ error: "`Component Code` is required." });

//   const code = req.query.code;

//     const condemnReStatus = 'Approved'
//     const types = 'WHOLE'
//      let sqlWhere = "";
//     let args = [];
//     sqlWhere = `and condemReStatus=?  and internalAssetCode = ?  and type = ?`;
//     args = [condemnReStatus,code,types];

//     let options = {
//       top: "",
//       order: "",
//     };
//     return await allotmentHistory.selectCondemHistory(
//       sqlWhere,
//       args,
//       options,
//       txn
//     );
//   });

//   if (returnValue.error !== undefined) {
//     return res.status(500).json({ error: `${returnValue.error}` });
//   }
//   return res.json(returnValue);
// };

const getPartsApprovedPartsWithMainAssetTRANSFER= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    if (util.empty(req.query.code))
    // return res.status(400).json({ error: "`Asset Code` is required." });
  return

  let code = req.query.code;

  
    const transferReStatus = 'Approved(with whole)'
     let sqlWhere = "";
    let args = [];
    sqlWhere = `and transferReStatus=? and active =? and code = ?`;
    args = [transferReStatus,1,code];

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
//this is working getPartsApprovedPartsWithMainAssetTRANSFER 
// const getPartsApprovedPartsWithMainAssetTRANSFER = async function (req, res) {

//   if (!req.query.code || req.query.code.length === 0) {
//       return 
//   }

//   // Proceed with function execution if `code` parameter is provided
//   const returnValue = await sqlHelper.transact(async (txn) => {
//       const transferReStatus = 'Approved(with whole)';
//       const codes = req.query.code.split(','); // Split the comma-separated codes into an array

//       let sqlWhere = `AND transferReStatus=? AND active=? AND code IN (?)`;
//       let args = [transferReStatus, 1, codes];

//       let options = {
//           top: "",
//           order: "",
//       };

//       return await assetsComponents.selectAllParts(sqlWhere, args, options, txn);
//   });

//   if (returnValue.error !== undefined) {
//       return res.status(500).json({ error: `${returnValue.error}` });
//   }
//   return res.json(returnValue);
// };

const getPartsApprovedPartOnly= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    // if (util.empty(req.query.code))
    // return res.status(400).json({ error: "`Asset Code` is required." });

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

const getParts= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    
    let condemnReStatus = "Approved"
     let condemnReStatus2 = "Approved(with whole)"
     let sqlWhere = "";
    let args = [];
    args = [condemnReStatus,condemnReStatus2];
    sqlWhere = ` and condemnReStatus<>? and condemnReStatus<>? `;
    

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

const getAllPartsInactive= async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    

    // let assetCode = req.query.assetCode;

     let userDeptCode = util.currentUserToken(req).deptCode
     let sqlWhere = "";
    let args = [];
    sqlWhere = `and active = ? and transferStatus = ? and receivingDepartment = ?`;
    args = [0,0,userDeptCode];

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

// const getAllParts= async function (req, res) {
//   const returnValue = await sqlHelper.transact(async (txn) => {
//     // if (util.empty(req.query.assetCode))
//     //   return res.status(400).json({ error: "`Asset Code` is required." });

//     // let assetCode = req.query.assetCode;
//     // console.log("assetCode############################",assetCode)

//     //  const userDeptCode = util.currentUserToken(req).depCode
//     //  console.log("assetCode##################userDeptCode##########",userDeptCode)
//     let sqlWhere = "";
//     let args = [];
//     sqlWhere = `and asstCompo.active = ?`;
//     args = [1];

//     let options = {
//       top: "",
//       order: "",
//     };
//     return await assetsComponents.selectAllParts(
//       sqlWhere,
//       args,
//       options,
//       txn
//     );
//   });

//   if (returnValue.error !== undefined) {
//     return res.status(500).json({ error: `${returnValue.error}` });
//   }
//   return res.json(returnValue);
// };

// const getInactiveComponents = async function (req, res) {
//   const returnValue = await sqlHelper.transact(async (txn) => {
//     let sqlWhere = "";
//     let args = [];
//     sqlWhere = `and asstCompo.active = ?`;
//     args = [0];

//     let options = {
//       top: "",
//       order: "",
//     };
//     return await assetsComponents.selectInactiveComponents(
//       sqlWhere,
//       args,
//       options,
//       txn
//     );
//   });

//   if (returnValue.error !== undefined) {
//     return res.status(500).json({ error: `${returnValue.error}` });
//   }
//   return res.json(returnValue);
// };

const putPartsInfo = async function (req, res) {
  const { compoCodes,itAssetCode} =req.body;
// console.log("8764654",itAssetCode)
  try {
    let partsInfo = "";
    // if (!compoCodes) {
    //   return res.status(400).json({ error: "Invalid component code." });
    // }
    const activeUser = util.currentUserToken(req).code
  
    partsInfo = await assetsComponents.updateAssetsComponents(
      {
        genericName: compoCodes.componentGenericName,
        updatedBy:activeUser,
        assetTagStatus: compoCodes.assetTagStatus,
        brandName: compoCodes.componentBrandName,
        receivingReportNo: compoCodes.receivingReportNo,
        itemCode: compoCodes.itemCode,
        unitCost: compoCodes.unitCost,
        discount: compoCodes.discount,
        netCost: compoCodes.netCost,
        serialNo: compoCodes.serialNo,
        supplier: compoCodes.supplier,
        model: compoCodes.model,
        dateReceived: compoCodes.dateReceived,
        remarks: compoCodes.remarks,
        // itAssetCode:compoCodes.itAssetCode,
        itAssetCode:itAssetCode,
        // originId: compoCodes.originId,
        accountingRefNo: compoCodes.accountingRefNo,
        capitalized: compoCodes.capitalized,
        specifications: compoCodes.specifications,

      },
      { code: compoCodes.componentCode }

    );   
    // console.log("check partsInfo",partsInfo)
    return res.status(200).json(partsInfo);
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const putPartsInfoAccounting = async function (req, res) {
  const { compoCodes,accountingRefNoInput,capitalizedInput} =
    req.body;
    
  try {
    let partsInfo = "";
    if (!compoCodes) {
      return res.status(400).json({ error: "Invalid component code." });
    }
    const activeUser = util.currentUserToken(req).code
    partsInfo = await assetsComponents.updateAssetsComponents(
      {     
        updatedBy:activeUser,

        accountingRefNo: accountingRefNoInput,
        capitalized: capitalizedInput,

      },
      { code: compoCodes.componentCode }
   
    );
    return res.status(200).json(partsInfo);
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const putPartsCancelTransfer = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const {assetsInfo,parts} = req.body;
    // if (util.empty(req.query.assetsInfo)){  return res.status(400).json({ error: "`Transfer Form Number` is required." });}
  
    assets 
  // let transferFormNo = req.query.transferFormNo;
   let tranferFormUpdate = "N/A" 
   let transferReStatus="Canceled" 
   let itemType = "PARTS"
   const activeUser = util.currentUserToken(req).code
    try {
      let updatePartsInfo = "";

   
      for (let asstInf of parts) {
        const prefixs = "PAHLC"
        let generatedCode = await sqlHelper.generateUniqueCode(
          "UERMINV..AssetAllotmentHistory",
          prefixs.toUpperCase(),
          2,
          txn
        );
        let assetsPayload = {
          code: generatedCode,
          assetCode:asstInf.componentAssetCode,
     fromDeptCode:asstInf.receivingDepartment,
    //  toDeptCode:asstInf.transferredDepartment,
     tranferringAssetCode:asstInf.transferingAssetCode,
     transferFormNo:asstInf.transferFormNo, 
     genericName:asstInf.componentGenericName,
     transferReStatus:transferReStatus,
          transferringRequestedDate:asstInf.transferRequestedDate,
          createdBy: activeUser,
          transferStatus:false,
          type:itemType,
          internalAssetCode:asstInf.internalAssetCode,
          componentCode:asstInf.componentCode
        };
  
        await assets.insertAssetsTransfer(
          assetsPayload,
          txn
        );

      }
      updatePartsInfo = await assetsComponents.updateAssetsComponents(
  {
    transferStatus:true,
    transferReStatus:transferReStatus,
    cancelStatus:true,
    transferFormNo:tranferFormUpdate,
    active:true
 
  },
  { transferFormNo: assetsInfo },
  txn
);


      return res.status(200).json(updatePartsInfo);

    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Internal server error. this is catch" });
    }
  });
  return returnValue;
};

const putUnassignedComponent = async function (req, res) {
  const { componentCode} =
    req.body;

  try {
    let unassignedComponent = "";
    if (!componentCode) {
      return res.status(400).json({ error: "Invalid component code." });
    }
    const activeUser = util.currentUserToken(req).code
    let activeValue = false;
    unassignedComponent = await assetsComponents.updateAssetsComponents(
      {
        // code: componentCode,
        active: activeValue,
        // genericName: componentGenericName,
        // description: componentDescription,
        // dateReceived:dateReceived,
        updatedBy:activeUser,
      },
      { code: componentCode }
    );
    return res.status(200).json(unassignedComponent);
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const putReassignComponent = async function (req, res) {
  const {
    componentCode,
    // componentGenericName,
    // componentDescription,
    assetCode,
  } = req.body;

  try {
    let updatedComponent = "";
    // if (!componentCode || !assetCode) {
    //   return res
    //     .status(400)
    //     .json({ error: "Invalid component code or asset code." });
    // }
    const activeUser = util.currentUserToken(req).code
    let activeValue = true; 
    updatedComponent = await assetsComponents.updateAssetsComponents(
      {
        // code: componentCode,
        active: activeValue,
        // genericName: componentGenericName,
        // description: componentDescription,
        assetCode: assetCode,
        updatedBy:activeUser,
      },
      { code: componentCode }
    );

    return res.status(200).json(updatedComponent);
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const postRegisterComponent = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`body` is required." });
  const returnValue = await sqlHelper.transact(async (txn) => {
    const assetsComponentInfo = req.body;

// console.log("ets",assetsComponentInfo)
const catCode = assetsComponentInfo.catCoding

    try {
      let generatedCode = "";
      let assetStatus = "";
      assetStatus = await sqlHelper.transact(async (txn) => {
        generatedCode = await sqlHelper.generateUniqueCode(
          "UERMINV..AssetsComponents",
          `${catCode.toUpperCase()}AC`,
          // `AC`,
   
          txn
        );
        const activeUser = util.currentUserToken(req).code
        let assetsPayload = {
          code: generatedCode,
          internalAssetCode:assetsComponentInfo.internalAssetCode,
          receivingDepartment:assetsComponentInfo.receivingDepartment,
          assetCode: assetsComponentInfo.assetCode, // Use the extracted assetCode
          genericName: assetsComponentInfo.componentGenericName,
          brandName: assetsComponentInfo.componentBrandName,
          // description: assetsComponentInfo.componentDescription,
          dateReceived:assetsComponentInfo.dateReceived,
          createdBy:activeUser,
          categoryId:assetsComponentInfo.categoryId,
          remarks:assetsComponentInfo.remarks,
          itemCode :assetsComponentInfo.itemCode,
          unitCost:assetsComponentInfo.unitCost,
          discount:assetsComponentInfo.discount,
          netCost:assetsComponentInfo.netCost,
          serialNo :assetsComponentInfo.serialNo,
          specifications:assetsComponentInfo.specifications,
       supplier:assetsComponentInfo.supplier,
       model:assetsComponentInfo.model,
       itAssetCode:assetsComponentInfo.itAssetCode,
      //  transferFormNo:assetsComponentInfo.transferFormNo,
      originId:assetsComponentInfo.originCode,
       administrator:assetsComponentInfo.administrator,
       transferStatus:assetsComponentInfo.transferStatus,
      //  assetTagStatus:assetsComponentInfo.assetTagStatus,
       receivingReportNo:assetsComponentInfo.receivingReportNo,
       receivingDepartment:assetsComponentInfo.receivingDepartment,
       location:assetsComponentInfo.physicalLocation

        };
     
        let insertAssetStatus = await assetsComponents.insertAssetsComponents(
          assetsPayload,
          txn
        );
  //  console.log("ets assetsPayload",assetsPayload)
        if (insertAssetStatus.error) {
          throw error.message;
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

module.exports = {
  getCurrentAssignedComponents,
  // getInactiveComponents,
  putUnassignedComponent,
  putReassignComponent,
  postRegisterComponent,
  putPartsInfo,
  getAllParts,
  getAllPartsInactive,
  getParts,
  getIncludedPartsToTransfer,
  getPartsTransferPrint,
  getPartsActiveInactive,
  putPartsCancelTransfer,
  getRetiredPartsAll,
  getPartsActiveInactiveNoDeptLimit,
  getPartsInactive,
  getPartsApprovedPartsWithMainAsset,
  getPartsApprovedPartsWithMainAssetTRANSFER,
  putPartsInfoAccounting,getPartsLogApproved,
  getIncludedPartsWithWhole,
  getPartsApprovedPartOnly,
  getIncludedPartsInformationReview,
  getPendingCondemParts,
  getPartsActiveOnly,
  getAllPartsByPassCondem,
  getCondemLogInfo,
  getAllCEParts,
  getPartsByAssetCode,
  getComponentParts
  // getCondemLogParts,
  // getCondemLogAssets

  
};