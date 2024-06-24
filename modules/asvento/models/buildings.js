const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

const selectBuilding = async function (conditions, args, options, txn) {
  return await sqlHelper.query(
    `select
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
			id
      ,buildingCode
      ,buildingName
      ,active
      ,createdBy
      ,updatedBy
      ,dateTimeCreated
      ,dateTimeUpdated
      ,remarks
		from [UERMINV].[dbo].[AssetsBuilding]
		where 1=1 ${conditions}
      ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
    args,
    txn
  );
};

module.exports = {
  selectBuilding,
};