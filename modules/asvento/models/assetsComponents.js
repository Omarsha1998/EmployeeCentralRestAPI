const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

const selectAssignedComponents = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
			asst.code,
      --asst.itemCode,
      asst.categoryId,
     --asst.dateReceived,
      asst.genericName,
asstCompo.assetCode componentAssetCode,
      asstCompo.code componentCode,
      asstCompo.genericName componentGenericName,
      asstCompo.receivingDepartment,
      asst.receivingDepartment,
      --asst.remarks,
      asst.supplierId,
      asst.poNumber,
      asst.invoiceNumber,
      asst.brandName,
      --asst.model,
      asst.serialNumber,
      asst.condemRemarks,
      --asst.specifications,
      asst.unitCost,
      asst.status,
      asst.oldAssetCode, 
      asst.location,
      asst.transferredDepartment,
      asstCompo.active,
      asstCompo.brandName componentBrandName,
      asstCompo.remarks componentDescription,
      asstCompo.dateReceived dateReceived,
      asstCompo.discount,
      asstCompo.originId,
      asstCompo.receivingReportNo,
      asstCompo.netCost,
      asstCompo.unitCost as compoUnitCost,
      asstCompo.itAssetCode as compoitAssetCode,
      asstCompo.serialNo,
      asstCompo.specifications,
      asstCompo.supplier,
      asstCompo.assetCode,
      asstCompo.quantity,
      asstCompo.transferFormNo,
      asstCompo.administrator,
      asstCompo.transferStatus,
      asstCompo.transferReStatus,
      asstCompo.assetTagStatus,
      asstCompo.remarks,
      asstCompo.itemCode,
      asstCompo.model,
      asstCompo.internalAssetCode,
      asstCompo.itAssetCode,
      asstCompo.condemnRequestedDate,
      asstCompo.movedAssetCode,
      asstCompo.condemRemarks,
      asstCompo.condemnReStatus,
      asst.condemRemarks,
       asst.createdBy,
       asst.updatedBy,
       asst.dateTimeCreated,
        asst.dateTimeUpdated
		from UERMINV..Assets asst
    left join UERMINV..AssetsComponents asstCompo on asst.code = asstCompo.internalAssetCode 
		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};


const selectAllParts = async function (conditions, args, options, txn) {
  try {
    return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
		
asstCompo.assetCode componentAssetCode,
      asstCompo.code componentCode,
      asstCompo.genericName componentGenericName,
    asstCompo.unitCost,
      asstCompo.active,
      asstCompo.brandName componentBrandName,
      asstCompo.remarks componentDescription,
      asstCompo.dateReceived dateReceived,
      asstCompo.discount,
      asstCompo.originId,
      asstCompo.receivingReportNo,
      asstCompo.netCost,
      asstCompo.serialNo,
      asstCompo.remarks,
      asstCompo.itemCode,
      asstCompo.model,
      asstCompo.categoryId,
      asstCompo.supplier,
      asstCompo.assetCode,
      asstCompo.quantity,
      asstCompo.transferFormNo,
      asstCompo.administrator,
      asstCompo.transferStatus,
      asstCompo.specifications,
      asstCompo.assetTagStatus,
      asstCompo.receivingDepartment,
      asstCompo.transferredDepartment,
      asstCompo.internalAssetCode,
      asstCompo.transferingAssetCode,
      asstCompo.condemnReStatus,
      asstCompo.transferReStatus,
      asstCompo.araForm,
      asstCompo.accountingRefNo,
      asstCompo.capitalized,
      asstCompo.itAssetCode,
      asstCompo.transferRequestedDate,
      asstCompo.condemnRequestedDate,
      asstCompo.movedAssetCode,
      asstCompo.outcome,
      asstCompo.releasedDate,
      asstCompo.condemRemarks
  
		from UERMINV..AssetsComponents asstCompo 
		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
  } catch (error) {
    console.log(error)
  }
  
};



const selectAllPartsDeCondemDepart = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
		
asstCompo.assetCode componentAssetCode,
      asstCompo.code ,
      asstCompo.genericName componentGenericName,
    asstCompo.unitCost,
      asstCompo.active,
      asstCompo.brandName componentBrandName,
      asstCompo.remarks componentDescription,
      asstCompo.dateReceived dateReceived,
      asstCompo.discount,
      asstCompo.originId,
      asstCompo.receivingReportNo,
      asstCompo.netCost,
      asstCompo.serialNo,
      asstCompo.remarks,
      asstCompo.itemCode,
      asstCompo.model,
      asstCompo.categoryId,
      asstCompo.supplier,
      asstCompo.assetCode,
      asstCompo.quantity,
      asstCompo.transferFormNo,
      asstCompo.administrator,
      asstCompo.transferStatus,
      asstCompo.specifications,
      asstCompo.assetTagStatus,
      asstCompo.receivingDepartment,
      asstCompo.transferredDepartment,
      asstCompo.internalAssetCode,
      asstCompo.transferingAssetCode,
      --asstCompo.condemnReStatus,
      asstCompo.transferReStatus,
      asstCompo.araForm,
      asstCompo.accountingRefNo,
      asstCompo.capitalized,
      asstCompo.itAssetCode,
      asstCompo.transferRequestedDate,
      asstCompo.condemnRequestedDate,
      asstCompo.movedAssetCode,
      asstCompo.outcome,
      asstCompo.releasedDate,
      asstCompo.condemRemarks,
      condemLog.AssetCode,
      condemLog.AraFormNo,
      condemLog.CondemnStatus,
  
      condemLog.RequestedDepartment,
      condemLog.Outcome,
      condemLog.ReleasedDate,
      condemLog.AraForm,
      condemLog.CondemRequestedDate,
      condemLog.CondemReStatus,
      condemLog.InternalAssetCode,
      condemLog.ComponentCode ,
      condemLog.GenericName,
      condemLog.Type,
      condemLog.DateTimeCreated
  
		from UERMINV..AssetsComponents asstCompo 
    left join UERMINV..CondemnationHistory condemLog on asstCompo.code = condemLog.componentCode 


		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};


const selectInactiveComponents = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      asstCompo.code componentCode,
      asstCompo.assetCode componentAssetCode,
      asstCompo.genericName componentGenericName,
      asstCompo.active,
      asstCompo.receivingDepartment,
       asstCompo.brandName componentBrandName,
        asstCompo.internalAssetCode
		from UERMINV..AssetsComponents asstCompo 
	where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,	
    txn
  );
};

const selectITAssetCodeExistence = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
        asstCompo.itAssetCode
		from UERMINV..AssetsComponents asstCompo 
	where 1=1 ${conditions}
union
select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
        asset.itAssetCode
		from UERMINV..Assets asset 
	where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,	
    txn
  );
};

const insertAssetsComponents = async function (payload, txn) {
  return await sqlHelper.insert("UERMINV..AssetsComponents", payload, txn);
};

const updateAssetsComponents = async function (payload, condition, txn) {
  try {
     return await sqlHelper.updateMany(
    "UERMINV..AssetsComponents",
    payload,
    condition,
    txn
  );
  } catch (error) {
    console.error(error)
  }
 
};


module.exports = {
  selectAssignedComponents,
  selectInactiveComponents,
  insertAssetsComponents,
  updateAssetsComponents,
  selectAllParts,
  selectITAssetCodeExistence,
  selectAllPartsDeCondemDepart
};
