const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

const getAccessRights = async function (conditions, txn, options) {
  return await sqlHelper.query(
    `select ITMgt.dbo.[fn_isAccess](
			${conditions}
		) isAccess`,
    [],
    txn
  );
};


const getAccessRightsAsvento = async function (conditions, txn, options) {
  return await sqlHelper.query(
    `select UERMINV.dbo.[AccessAsventoTest](
			${conditions}
		)`,
    [],
    txn
  );
};
module.exports = {
  getAccessRights,
  getAccessRightsAsvento
};
