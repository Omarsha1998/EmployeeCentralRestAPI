const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

const getDepartments = async function (conditions, args, options,  txn) {
  return await sqlHelper.query(
    `select
			${util.empty(options.top) ? "" : `TOP(${options.top})`}
			dept_code code,
			dept_desc name,
      dept_desc label,
      count(dept_code) employeeCount
		from [UE Database]..vw_Employees
		where 1=1 ${conditions}
		${util.empty(options.order) ? "" : `order by ${options.order}`}
		`,
    args,
    txn
  );
};

module.exports = {
  getDepartments,
};
