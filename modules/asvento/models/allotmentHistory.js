const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

const selectTransferHistory = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
			[Id]
      ,[Code]
      ,[FromDeptCode]
      ,[ToDeptCode]
      ,[Active]
      ,[DateTimeCreated]
      ,[DateTimeUpdated]
      ,[CreatedBy]
      ,[UpdatedBy]
      ,[Remarks]
      ,[TransferFormNo]
      ,[AssetCode]
      ,[TransferStatus]
      ,[CancelStatus]
      ,[Type]
      ,[TransferReStatus]
      ,[GenericName]
      ,[InternalAssetCode]
      ,[TransferringRequestedDate]
   ,[TranferringAssetCode]
   ,[ComponentCode]
  
		from [UERMINV].[dbo].[AssetAllotmentHistory]
		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};


const selectCondemHistory = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
			[Id]
      ,[Code]
      ,[AssetCode]
      ,[AraForm]
      ,[CondemnStatus]
      ,[Active]
      ,[RequestedDepartment]
      ,[Outcome]
      ,[ReleasedDate]
      ,[AuditedBy]
      ,[CondemRequestedDate]
      ,[CreatedBy]
      ,[DateTimeCreated]
      ,[UpdatedBy]
      ,[DateTimeUpdated]
      ,[CondemReStatus]
      ,[InternalAssetCode]
      ,[ComponentCode]
      ,[Type]
      ,[GenericName]
      ,[Remarks]
		from [UERMINV].[dbo].[CondemnationHistory]
		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};

const selectMaxTransferFormNo = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
    ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      MAX([TransferFormNo]) AS MaxTransferFormNo
		from [UERMINV].[dbo].[AssetAllotmentHistory]
		where 1=1 ${conditions}

      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};

module.exports = {
  selectTransferHistory,
  selectMaxTransferFormNo,
  selectCondemHistory
};