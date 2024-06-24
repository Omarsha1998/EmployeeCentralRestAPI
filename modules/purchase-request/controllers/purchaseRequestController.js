const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

// MODELS //
const purchaseRequests = require("../models/purchaseRequests.js");
const purchaseRequestItems = require("../models/purchaseRequestItems.js");
// MODELS //

// BASIC SELECT STATEMENTS //
const getPurchaseRequests = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    const deptCode = req.query.deptCode;
    const purchaseDeptCode = req.query.purchaseDeptCode;
    const reviewerDeptCode = req.query.reviewerDeptCode;
    const userCode = req.query.userCode;
    const approver = req.query.approver;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;

    try {
      let sqlWhere = "";
      if (deptCode) {
        if (approver) {
          sqlWhere = `and fromDepartment IN (${deptCode}) and convert(date, dateTimeCreated) between '${fromDate}' and '${toDate}'`;
        } else {
          sqlWhere = `and fromDepartment = '${deptCode}'  and convert(date,  dateTimeCreated) between '${fromDate}' and '${toDate}'`;
        }
      } else if (userCode) {
        sqlWhere = `and createdBy = '${userCode}'`;
      } else if (purchaseDeptCode) {
        sqlWhere = `and toDepartment IN (${purchaseDeptCode}) and convert(date, dateTimeApproved) between '${fromDate}' and '${toDate}'`;
      } else if (reviewerDeptCode) {
        sqlWhere = `and secondaryApprovingDepartment = '${reviewerDeptCode}' and convert(date, dateTimeApproved) between '${fromDate}' and '${toDate}'`;
      }
      const prSelect = await purchaseRequests.selectPurchaseRequests(
        sqlWhere,
        txn,
        {
          top: {},
          order:
            purchaseDeptCode !== undefined
              ? "dateTimeApproved asc"
              : "dateTimeCreated asc",
        },
      );

      if (prSelect.length > 0) {
        return prSelect;
      }
      return [];
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

const getPurchaseRequestTypes = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    try {
      const sqlWhere = "and active = 1";
      return await purchaseRequests.selectPurchaseRequestTypes(sqlWhere, txn, {
        top: {},
        order: "",
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

const getPurchaseRequestWithPO = async function (req, res) {
  const returnValue = await sqlHelper.transact(async (txn) => {
    try {
      const deptCode = req.query.deptCode;
      const fromDate = req.query.from;
      const toDate = req.query.to;

      const args = [deptCode, fromDate, toDate];
      const conditions = `and pp.FromDepartment = ?
      and convert(date, pp.DateTimeCreated)
      between  ? and ?`;

      return await purchaseRequests.selectPurchaseRequestsWithPO(
        conditions,
        args,
        {
          top: {},
          order: "",
        },
        txn,
      );
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

const getPurchaseRequestItems = async function (req, res) {
  if (util.empty(req.query.prCode)) {
    return res.status(400).json({ error: "`code` query in URL is required." });
  }

  const returnValue = await sqlHelper.transact(async (txn) => {
    const prCode = req.query.prCode;

    try {
      let sqlWhere = "";
      if (prCode) {
        sqlWhere = `and pr.code = '${prCode}'`;
      }
      return await purchaseRequestItems.selectPurchaseRequestItems(
        sqlWhere,
        txn,
        {
          top: {},
          order: "pr.dateTimeCreated desc",
        },
      );
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

const savePurchaseRequests = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`code` query in URL is required." });

  const returnValue = await sqlHelper.transact(async (txn) => {
    const prDetails = req.body.prDetails;
    const prItems = req.body.prItems;
    try {
      prDetails.code = await sqlHelper.generateUniqueCode(
        "UERMINV..PurchaseRequests",
        "PR",
        3,
        txn,
      );
      prDetails.createdBy = util.currentUserToken(req).code;
      prDetails.updatedBy = util.currentUserToken(req).code;
      const prDetailStatus = await purchaseRequests.insertPurchaseRequests(
        prDetails,
        txn,
      );
      if (Object.keys(prDetailStatus).length > 0) {
        for (const items of prItems) {
          const itemDetails = {
            prCode: prDetailStatus.code,
            itemCode: items.itemCode,
            name: items.brandName,
            description: items.genName,
            quantity: items.quantity,
            others: items.itemDescription,
            unit: items.dosageForm,
            otherDescription: items.mg,
            status: 1,
          };
          await purchaseRequestItems.insertPurchaseRequestItems(
            itemDetails,
            txn,
          );
        }
      }
      return prDetailStatus;
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

const updatePurchaseRequest = async function (req, res) {
  if (!req.body) return res.status(400).json({ error: "Invalid Parameters" });
  const returnValue = await sqlHelper.transact(async (txn) => {
    const payload = req.body;
    const code = req.params.code;
    delete req.body.code;
    // const employeeId = "7679"
    const employeeId = util.currentUserToken(req).code;
    if (req.body.status == 1) {
      if (req.body.rejected) {
        payload.rejectedBy = employeeId;
        payload.dateTimeRejected = await util.currentDateTime();
        delete req.body.rejected;
      }
    } else if (req.body.status == 2) {
      payload.approvedBy = employeeId;
      payload.dateTimeApproved = await util.currentDateTime();
    } else if (req.body.status == 3) {
      // Reviewed
      if (req.body.hfo) {
        payload.reviewedBy = employeeId;
        payload.dateTimeReviewed = await util.currentDateTime();
      } else {
        payload.approvedBy = employeeId;
        payload.dateTimeApproved = await util.currentDateTime();
      }
    } else if (req.body.status == 4) {
      // For PO Processing
      payload.completedBy = employeeId;
      payload.dateTimeCompleted = await util.currentDateTime();
    }
    delete payload.hfo;
    payload.updatedBy = employeeId;
    try {
      return await purchaseRequests.updatePurchaseRequest(
        payload,
        { code: code },
        txn,
      );
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

const updatePurchaseRequestItems = async function (req, res) {
  if (util.empty(req.body))
    return res.status(400).json({ error: "`code` query in URL is required." });
  const returnValue = await sqlHelper.transact(async (txn) => {
    const code = req.params.code;
    delete req.body.code;
    const prInfo = req.body.prInfo;
    const itemsAdd = req.body.itemsAdd;
    const itemsDelete = req.body.itemsDelete;
    const itemsUpdate = req.body.itemsUpdate;
    try {
      let prStatus = [];
      if (Object.keys(prInfo).length > 0) {
        prStatus = await purchaseRequests.updatePurchaseRequest(
          prInfo,
          { code: code },
          txn,
        );
      }

      if (itemsAdd.length > 0) {
        for (const itemAdd of itemsAdd) {
          itemAdd.prCode = code;
          await purchaseRequestItems.insertPurchaseRequestItems(itemAdd, txn);
        }
      }

      if (itemsDelete.length > 0) {
        for (const itemDelete of itemsDelete) {
          const itemId = itemDelete.id;
          delete itemDelete.id;
          itemDelete.active = 0;
          await purchaseRequestItems.updatePurchaseRequestItems(
            itemDelete,
            { id: itemId },
            txn,
          );
        }
      }

      if (itemsUpdate.length > 0) {
        for (const itemUpdate of itemsUpdate) {
          const itemId = itemUpdate.id;
          delete itemUpdate.id;
          await purchaseRequestItems.updatePurchaseRequestItems(
            itemUpdate,
            { id: itemId },
            txn,
          );
        }
      }

      return prStatus;
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
  getPurchaseRequests,
  getPurchaseRequestItems,
  getPurchaseRequestTypes,
  getPurchaseRequestWithPO,
  savePurchaseRequests,
  updatePurchaseRequest,
  updatePurchaseRequestItems,
};
