const util = require("../../../helpers/util");
const sqlHelper = require("../../../helpers/sql");

const getPersonnels = async function (conditions, args, options,  txn) {
  return await sqlHelper.query(
    `select
			${util.empty(options.top) ? "" : `TOP(${options.top})`}
			code,
			name,
			firstName,
			lastName,
			middleName,
			concat(lastName, ', ', firstName) fullName,
			concat(firstName, ' ', lastName) alternativeFullName,
			gender,
			bdate birthdate,
			email = case when UERMEmail is not null
				then UERMEmail
			else
				email
			end,
			mobileNo,
			pass password,
			dept_code deptCode,
			dept_desc deptDesc,
			pos_desc posDesc,
			civil_status_desc civilStatusDesc,
			[group],
			emp_class_desc empClassDesc,
			emp_class_code empClassCode,
			address,
			[SERVICE YEARS] serviceYears,
			is_active isActive
		from [UE Database]..vw_Employees
		where 1=1 ${conditions}
		
		${util.empty(options.order) ? "" : `order by ${options.order}`}
		`,
    args,
    txn
  );
};

module.exports = {
  getPersonnels,
};
