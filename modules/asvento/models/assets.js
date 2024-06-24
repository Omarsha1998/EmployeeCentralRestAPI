const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");
const { query } = require("express");


const selectAssets = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
			code,
      --assetCode,
      receivingReportNo,
      netCost,
      discount,
      countedBy,
      accountingAssetCode,
      oldAssetCode,
      receivingDepartment,
      itemCode,
      categoryId,
      dateReceived,
      supplierId,
      originId,
    --poNumber,
      invoiceNumber,
      genericName,
      brandName,
      model,
      serialNumber,
    specifications,
      unitCost,
      status,
      location,
      transferredDepartment,
      createdBy,
      updatedBy,
      dateTimeCreated,
      dateTimeUpdated,
      remarks,
      assetTagStatus,
      accountingRefNo,
      itAssetCode,
     -- Concat(ItAssetCode,'/',TotalSets) AS itAssetCodeConcat,
      active,
      quantity,
      administrator,
      transferStatus,
      transferFormNo,
      condemnStatus,
      donor,
      donationNo,
      capitalized,
     araForm,
   auditedBy,
   cancelStatus,
   condemnReStatus,
   transferReStatus,
      releasedDate,
   outcome,
   allotmentRemarks,
   transferRequestBy,
   transferRequestedDate,
   condemRequestedDate,
   condemRemarks,
   totalSets,
     CASE  WHEN totalSets IS NULL OR totalSets = '' THEN itAssetCode
        ELSE CONCAT(itAssetCode, '/', totalSets)
    END AS itAssetCodeConcat

      
		from UERMINV..Assets
		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};

const selectRetiredAssetsLog = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      asst.code,
      asst.oldAssetCode,
      asst.releasedDate, asst.condemRequestedDate,
      asst.itemCode,
         asst.categoryId,
      asst.dateReceived,
         asst.genericName,
         asst.receivingDepartment,
       asst.remarks,
         asst.supplierId,
         asst.poNumber,
         asst.invoiceNumber,
         asst.brandName,
      asst.model,
      asst.originId,
         asst.serialNumber,
         asst.condemRemarks,
      asst.specifications,
         asst.unitCost,
         asst.discount,
         asst.netCost,
         asst.status,
   asst.assetTagStatus,
         asst.location,
         asst.araForm,
         asst.administrator,
         asst.active,
         asst.totalSets,
         asst.quantity,
         asst.dateTimeUpdated,
         asst.transferredDepartment,
            asstCompo.AssetCode,
         asstCompo.AraFormNo,
         asstCompo.CondemnStatus,
  
         asstCompo.RequestedDepartment,
         asstCompo.Outcome,
         asstCompo.ReleasedDate,
         asstCompo.AraForm,
         asstCompo.CondemRequestedDate,
         asstCompo.CondemReStatus,
         asstCompo.InternalAssetCode,
         asstCompo.ComponentCode,
         asstCompo.GenericName,
         asstCompo.Type,
         asstCompo.DateTimeCreated
       from UERMINV..Assets asst
       left join UERMINV..CondemnationHistory asstCompo on asst.code = asstCompo.internalAssetCode 
		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};
const selectAssetsNoDuplicate = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      DISTINCT  transferFormNo, transferredDepartment, transferRequestedDate
      
		from UERMINV..Assets
		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};

const selectAssetsARANoDuplicate = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      DISTINCT  transferFormNo, receivingDepartment, transferredDepartment,transferRequestedDate
		from UERMINV..Assets
		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};

//for condemn
const ARAFormDistinct = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      DISTINCT  araForm, receivingDepartment
      
		from UERMINV..Assets
		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};


const selectPartsNoDuplicate = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      DISTINCT  transferFormNo, receivingDepartment, transferRequestedDate, transferingAssetCode
      
		from UERMINV..AssetsComponents
		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};

const selectPartsNoDuplicateARA = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      DISTINCT  araForm, receivingDepartment
      
		from UERMINV..AssetsComponents
		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};

const selectAssetsTesting = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
			code,
      --assetCode,
      receivingReportNo,
      netCost,
      discount,
      countedBy,
      accountingAssetCode,
      oldAssetCode,
      receivingDepartment,
      itemCode,
      categoryId,
      dateReceived,
      supplierId,
      originId,
    --poNumber,
      invoiceNumber,
      genericName,
      brandName,
      model,
      serialNumber,
    specifications,
      unitCost,
      status,
      location,
      transferredDepartment,
      createdBy,
      updatedBy,
      dateTimeCreated,
      dateTimeUpdated,
      remarks,
      assetTagStatus,
      accountingRefNo,
      itAssetCode,
      Concat(ItAssetCode,'/',TotalSets) AS itAssetCodeConcat,
      active,
      quantity,
      administrator,
      condemnReStatus,
      transferReStatus,
      transferRequestBy,
      condemRequestedDate,
      totalSets
		from UERMINV..Assets
		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};

const selectOldAssets = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
			itemId,
      genericName,
      deptCode,
      categoryCode,
      unitCost,
      newUnitCost,
      setNo,
      dateReceived,
      supplierName,
      purchaseOrderNo,
      invoiceNo,
      brandName,
      brandModel,
      serialNo,
      itemSpecs,
      newAssetCode,
      assetTagStatus,
      itemRemarks,
      oldAssetCode,
      --physicalLocation,
      itemCode,
      receivingReport,
      condemned,
      salvaged,
      deleted,
      transferred, 
      dateTimeCreated,
      dateTimeUpdated,
      remarks,
      totalSets
   
		from UERMINV..fxAssets
		WHERE 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );

};

//
const insertAssets = async function (payload, txn) {
  return await sqlHelper.insert("UERMINV..Assets", payload, txn);
};

const insertNewAssetCode = async function (payload, txn) {
  return await sqlHelper.insert("UERMINV..AssetCodeRegistry", payload, txn);
};

//ALLOTMENT TRANSFER 1/29/2024
const insertAssetsTransfer = async function (payload, txn) {
  return await sqlHelper.insert("UERMINV..AssetAllotmentHistory", payload, txn);
};

//condemnation requests 2/13/2024
const insertAssetsCondemn= async function (payload, txn) {
  try {
    return await sqlHelper.insert("UERMINV..CondemnationHistory", payload, txn);
  } catch (error) {
    console.error(error)
  }

};

// const updateAssetTransfer = async function (payload, condition, txn) {
//   return await sqlHelper.update("UERMINV..AssetAllotmentHistory", payload, condition, txn);
// };


const insertExcelData = async function (payload, txn) {
  return await sqlHelper.insert("UERMINV..Assets", payload, txn);
};


const updateAssetsOne = async function (payload, condition, txn) {
  return await sqlHelper.update("UERMINV..Assets", payload, condition, txn);
};
const updateAssets = async function (payload, condition, txn) {
  
  try {
    return await sqlHelper.updateMany("UERMINV..Assets", payload, condition, txn);
  } catch (error) {
    console.error(error)
  }
};

const updateOldAssets = async function (payload, condition, txn) {
  return await sqlHelper.update("UERMINV..fxAssets", payload, condition, txn);
};

module.exports = {
  selectAssets,
  selectOldAssets,
  insertAssets,
  updateAssets,
  updateOldAssets,
  insertExcelData,
  selectAssetsTesting,
  insertAssetsTransfer,
  insertAssetsCondemn,
  insertNewAssetCode,
  selectAssetsNoDuplicate,
  selectPartsNoDuplicate,
  ARAFormDistinct,
  selectAssetsARANoDuplicate,
  selectPartsNoDuplicateARA,
  updateAssetsOne,
  selectRetiredAssetsLog
  // updateAssetTransfer
};
