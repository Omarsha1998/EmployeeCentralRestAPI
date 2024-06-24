const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

// MODELS //
const items = require("../models/items.js");
// MODELS //

// BASIC SELECT STATEMENTS //
const getItems = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    // if (util.empty(req.query.searchQuery) || util.empty(req.query.all))
    //   return res.status(400).json({ error: "Invalid parameter." });
    const searchQuery = req.query.searchQuery;
    const groupCondition = req.query.groupCondition;
    const all = req.query.all;
    try {
      let sqlWhere = "";
      let sqlTop = "";
      if (all) {
        sqlWhere = "and discontinue = 0";
      } else {
        let sqlGroupCondition = "";
        if (groupCondition !== "") {
          sqlGroupCondition = `and phicGroupCode = '${groupCondition}'`;
        }
        sqlTop = 50;
        sqlWhere = `and discontinue = 0 ${sqlGroupCondition} and (
          brandName LIKE '%${searchQuery}%' OR
          genName LIKE '%${searchQuery}%' OR
          itemCode LIKE '%${searchQuery}%'
        )`;
      }
      return await items.selectItems(sqlWhere, txn, {
        top: sqlTop,
        order: "itemCode",
      });
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const getAllotedItems = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const searchQuery = req.query.searchQuery;
    const deptCode = req.query.deptCode;
    const isHospitalUser = req.query.isHospitalUser === "true";
    const isAsset = req.query.isAsset === "true";
    const isForSale = req.query.isForSale === "true";
    const groupCondition = req.query.groupCondition;
    try {
      let sqlWhere = "";
      const sqlTop = "";

      if (isHospitalUser) {
        if (isAsset) {
          sqlWhere = `and phi.phicGroupCode = 'ASS' and (
            phi.brandName LIKE '%${searchQuery}%' OR
            phi.genName LIKE '%${searchQuery}%' OR
            itl.itemCode LIKE '%${searchQuery}%'
          ) 
          and phi.discontinue = 0`;
        } else if (isForSale) {
          sqlWhere = `and itl.DepartmentCode = '${deptCode}' 
          and convert(char(4),getDate(),112) >='2023'
          and phi.discontinue = 0 and phi.ForSale = 1`;
        } else {
          sqlWhere = `and itl.DepartmentCode = '${deptCode}' 
          and phi.discontinue = 0 and phi.ForSale <> 1`;
        }
      } else {
        if (isAsset) {
          sqlWhere = `and phi.phicGroupCode = 'ASS' and (
            phi.brandName LIKE '%${searchQuery}%' OR
            phi.genName LIKE '%${searchQuery}%' OR
            itl.itemCode LIKE '%${searchQuery}%'
          ) 
          and phi.discontinue = 0`;
        } else {
          sqlWhere = `and itl.dept = '${deptCode}' 
          and convert(char(4),getDate(),112) >='2023'
          and phi.discontinue = 0`;
        }
      }

      // if (searchQuery) {
      //   sqlWhere = `and discontinue = 0 and departmentCode = '${deptCode}' and (
      //       brandName LIKE '%${searchQuery}%' OR
      //       genName LIKE '%${searchQuery}%'
      //     )`;
      // } else {
      //   sqlTop = "";
      //   sqlWhere = `and discontinue = 0 and active = 1 and departmentCode = '${deptCode}'`;
      // }

      let departmentItems = [];
      if (isHospitalUser) {
        departmentItems = await items.selectAllottedItemsHospital(
          sqlWhere,
          txn,
          {
            top: sqlTop,
            order: "phi.genName, itemCode  desc",
          },
        );
      } else {
        departmentItems = await items.selectAllottedItems(sqlWhere, txn, {
          top: sqlTop,
          order: "phi.genName, itemCode  desc",
        });
      }

      // if (searchQuery) {
      //   if (departmentItems.length === 0) {
      //     sqlWhere = `and discontinue = 0 and isGeneral = 1 and (
      //     brandName LIKE '%${searchQuery}%' OR
      //     genName LIKE '%${searchQuery}%'
      //   )`;
      //     departmentItems = await items.selectItems(sqlWhere, txn, {
      //       top: sqlTop,
      //       order: "itemCode",
      //     });
      //   }
      // }
      return departmentItems;
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const getDepartmentItems = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const searchQuery = req.query.searchQuery;
    const deptCode = req.query.deptCode;
    try {
      let sqlWhere = "";
      let sqlTop = 50;
      if (searchQuery) {
        sqlWhere = `and discontinue = 0 and departmentCode = '${deptCode}' and (
            brandName LIKE '%${searchQuery}%' OR
            genName LIKE '%${searchQuery}%'
          )`;
      } else {
        sqlTop = "";
        sqlWhere = `and discontinue = 0 and active = 1 and departmentCode = '${deptCode}'`;
      }

      let departmentItems = 0;
      departmentItems = await items.selectDepartmentItems(sqlWhere, txn, {
        top: sqlTop,
        order: "d.itemCode",
      });

      if (searchQuery) {
        if (departmentItems.length === 0) {
          sqlWhere = `and discontinue = 0 and isGeneral = 1 and (
          brandName LIKE '%${searchQuery}%' OR
          genName LIKE '%${searchQuery}%'
        )`;
          departmentItems = await items.selectItems(sqlWhere, txn, {
            top: sqlTop,
            order: "itemCode",
          });
        }
      }
      return departmentItems;
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const insertDepartmentItems = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`code` query in URL is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
    const itemDetails = req.body;
    try {
      let itemStatus = "";
      if (util.isObj(itemDetails)) {
        itemDetails.createdBy = util.currentUserToken(req).code;
        itemDetails.updatedBy = util.currentUserToken(req).code;
        itemStatus = await items.insertDepartmentItems(itemDetails, txn);
      } else {
        for (const item of itemDetails) {
          item.createdBy = util.currentUserToken(req).code;
          item.updatedBy = util.currentUserToken(req).code;
          itemStatus = await items.insertDepartmentItems(item, txn);
        }
      }
      return itemStatus;
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const insertDepartmentItemsTest = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const sqlWhere = `and
          convert(char(4),TIMESTAMP,112) >='2023'
          and TRANSCODE in('CHARGING','ALLOTMENT')
          and phi.discontinue = 0`;

    const itemDetails = await items.selectAllottedItems(sqlWhere, txn, {
      top: "",
      order: "",
    });

    let itemStatus = "";
    if (itemDetails.length > 0) {
      for (const item of itemDetails) {
        const payload = {
          itemCode: item.itemCode,
          departmentCode: item.dept,
          type: "hos",
        };
        console.log(payload);
        itemStatus = await items.insertDepartmentItems(payload, txn);
      }
    }

    return true;
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const updateDepartmentItems = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`code` query in URL is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
    const itemDetails = req.body;
    try {
      let itemStatus = "";
      if (util.isObj(itemDetails)) {
        const code = itemDetails.id;
        delete itemDetails.id;
        itemDetails.updatedBy = util.currentUserToken(req).code;
        itemStatus = await items.updateDepartmentItems(
          itemDetails,
          { id: code },
          txn,
        );
      } else {
        for (const item of itemDetails) {
          item.updatedBy = util.currentUserToken(req).code;
          const code = item.id;
          delete item.id;
          itemStatus = await items.updateItems(item, { itemCode: code }, txn);
        }
      }
      return itemStatus;
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

const updateItems = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`code` query in URL is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
    const itemDetails = req.body;
    try {
      let itemStatus = "";
      if (util.isObj(itemDetails)) {
        const code = itemDetails.itemCode;
        delete itemDetails.itemCode;
        itemStatus = await items.updateItems(
          itemDetails,
          { itemCode: code },
          txn,
        );
      } else {
        for (const item of itemDetails) {
          item.updatedBy = util.currentUserToken(req).code;
          const itemCode = item.itemCode;
          delete item.itemCode;
          itemStatus = await items.updateItems(
            item,
            { itemCode: itemCode },
            txn,
          );
        }
      }

      // if (util.isObj(itemDetails)) {
      //   itemDetails.createdBy = util.currentUserToken(req).code;
      //   itemDetails.updatedBy = util.currentUserToken(req).code;
      //   itemStatus = await items.insertDepartmentItems(itemDetails, txn);
      // } else {
      //   for (var item of itemDetails) {
      //     item.createdBy = util.currentUserToken(req).code;
      //     item.updatedBy = util.currentUserToken(req).code;
      //     itemStatus = await items.insertDepartmentItems(item, txn);
      //   }
      // }

      return itemStatus;
    } catch (error) {
      console.log(error);
      return { error: error };
    }
  });

  if (returnValue.error !== undefined) {
    return res.status(500).json({ error: `${returnValue.error}` });
  }
  return res.json(returnValue);
};

module.exports = {
  getItems,
  getAllotedItems,
  getDepartmentItems,
  insertDepartmentItems,
  insertDepartmentItemsTest,
  updateDepartmentItems,
  updateItems,
};
