const sqlHelper = require("../../../helpers/sql");

const getDTRDetails = async (
  startDate,
  endDate,
  employeeCode,
  additionalParameter,
) => {
  // try {
  //     const DTRQuery = `
  //       EXEC HR.dbo.Usp_jf_DTRv2
  //         ${sqlWhereStrArr.join(', ')};
  //     `;

  //     const result = await conn
  //       .request()
  //       .input('startDate', sql.VarChar, args.startDate)
  //       .input('endDate', sql.VarChar, args.endDate)
  //       .input('employeeCode', sql.VarChar, args.employeeCode)
  //       .input('additionalParameter', sql.VarChar, args.additionalParameter)
  //       .query(DTRQuery);

  //     return result.recordset;
  // } catch (error) {
  //     console.error(error);
  //     return { status: 500, message: 'Failed to retrieve DTR Details' };
  // }
  return await sqlHelper.query(
    `EXEC HR.dbo.Usp_jf_DTRv2 
      '${startDate}',
      '${endDate}',
      '${employeeCode}',
      '${additionalParameter}';
      `,
    [],
  );
};

const noDtrEmployee = async () => {
  return await sqlHelper.query(
    `SELECT Position, PositionCode
      FROM [UE database]..NoDtrEmployee
      `,
  );
};

module.exports = { getDTRDetails, noDtrEmployee };
