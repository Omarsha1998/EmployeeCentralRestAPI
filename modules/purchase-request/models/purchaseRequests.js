const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

const selectPurchaseRequestTypes = async function (conditions, txn, options) {
  return await sqlHelper.query(
    `SELECT
        ${util.empty(options.top) ? "" : `TOP(${options.top})`}
        code,
        name,
        description,
        active,
        dateTimeCreated,
        dateTimeUpdated
      from UERMINV..PurchaseRequestTypes
      WHERE 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
      `,
    [],
    txn
  );
};

const selectPurchaseRequests = async function (conditions, txn, options) {
  return await sqlHelper.query(
    `SELECT
        ${util.empty(options.top) ? "" : `TOP(${options.top})`}
        code, 
        type,
        description,
				fromDepartment,
        toDepartment,
        secondaryApprovingDepartment,
        dateNeeded,
				status,
        approvedBy,
        reviewedBy,
        completedBy,
        createdBy,
        updatedBy,
        rejectedBy,
        rejectingRemarks,
        dateTimeApproved,
        dateTimeReviewed,
        dateTimeCompleted,
        dateTimeCreated,
        dateTimeUpdated,
        dateTimeRejected
      from UERMINV..PurchaseRequests
      WHERE 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
      `,
    [],
    txn
  );
};

const selectPurchaseRequestsWithPO = async function (
  conditions,
  args,
  options,
  txn
) {
  try {
    const rows = await sqlHelper.query(
      `SELECT
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      pr.itemcode,
      prpoitemcode=isnull(po.itemcode,''),
      itemtype=pp.Type,
      qty=pr.Quantity,
      uom=pr.Unit,
      unitcost=p.UnitPricePerPc,
      totalcost=round(pr.Quantity*p.UnitPricePerPc,2),
      prno=pp.COde,
      requestingdept=pp.FromDepartment,
      requestingdeptdesc=s.description,
      inventorytype=pp.[type],
      p.brandname ,
      p.genname,
      p.mg,
      p.dosageform,
      description=brandname+' '+GenName +' '+MG +' '+DosageForm,
      prpoqty=isnull(po.prpoqty,0),
      prpobal=pr.Quantity-isnull(po.prpoqty,0),
      prponos=isnull(po.prponos,''),
      prdetailsid=pr.id,
      pp.DateTimeCreated dateTimePurchaseRequest
    from UERMINV..PurchaseRequestItems pr
      inner join UERMINV..PurchaseRequests pp on pr.prCOde=pp.Code
      inner join UERMMMC..PHAR_ITEMS p on pr.itemcode=p.itemcode COLLATE Latin1_General_CI_AS
      inner join UERMMMC..SECTIONS s on pp.FromDepartment =s.CODE COLLATE Latin1_General_CI_AS
      left join UERMINV..vw_PRwithPO po on pr.Id=po.prdetailsid
    WHERE 1=1  ${conditions}
    ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
      args,
      txn
    );
    return rows
  } catch (error) {
    console.log(error);
  }
};

const insertPurchaseRequests = async function (payload, txn) {
  return await sqlHelper.insert("UERMINV..PurchaseRequests", payload, txn);
};

const updatePurchaseRequest = async function (payload, condition, txn) {
  return await sqlHelper.update(
    "UERMINV..PurchaseRequests",
    payload,
    condition,
    txn
  );
};

module.exports = {
  selectPurchaseRequests,
  insertPurchaseRequests,
  updatePurchaseRequest,
  selectPurchaseRequestTypes,
  selectPurchaseRequestsWithPO,
};
