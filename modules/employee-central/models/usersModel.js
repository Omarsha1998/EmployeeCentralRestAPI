const md5 = require("md5");
const sqlHelper = require("../../../helpers/sql.js");
const helpers = require("../../../helpers/crypto.js");
const {
  getAccessRights,
} = require("../../access-rights/controllers/accessRightsController.js");
const helperMethods = require("../utility/helperMethods.js");

async function getDetails(condition) {
  return (
    await sqlHelper.query(
      `
      SELECT
        TRIM(E.EmployeeCode) AS 'employee_id',
        TRIM(U.[PASSWORD]) AS 'password',
        TRIM(E.LastName + ', ' + E.FirstName + ' ' + E.MiddleName + '. ' + E.ExtName) AS 'employee_full_name',
        E.PositionCode,
        E.Officer,
        CASE
          WHEN (SELECT COUNT(RecNo) FROM HR..EmpWorkExp AS W WHERE W.Deleted = 0 AND W.EmployeeCode = E.EmployeeCode) > 0 THEN 1
          ELSE 0
        END AS 'has_work_experience',
        CASE
          WHEN (SELECT COUNT(RecNo) FROM [UE database]..License AS L WHERE L.Deleted = 0 AND L.PrcLicense = 1 AND L.deleted = 0 AND L.EmployeeCode = E.EmployeeCode) > 0 THEN 1
          ELSE 0
        END AS 'is_license',
        CASE
          WHEN D.DeptCode = '5040' THEN 1
          ELSE 0
        END AS 'isHR',
        TRIM(E.DeptCode) AS 'department_code'
      FROM [UE database]..Employee AS E
      INNER JOIN ITMgt..Users U ON U.CODE = E.EmployeeCode
      LEFT JOIN [UE database]..Department D ON E.DeptCode = D.DeptCode
      WHERE E.EmployeeCode = ?
      `,
      [condition],
    )
  )[0];
}

async function getApproverAccess(code, moduleName, appName) {
  const req = {
    query: {
      code: code,
      moduleName: moduleName,
      appName: appName,
    },
  };

  let capturedResult;
  const res = {
    json: function (data) {
      capturedResult = data;
    },
  };
  await getAccessRights(req, res);

  const result = capturedResult[0].isAccess;
  return result;
}

async function getToken(userData) {
  const appName = "Employee Portal";
  const moduleName1 = "PIS Approver";
  const moduleName2 = "Leave Approver";

  const user = {
    employee_id: userData.employee_id,
    employee_full_name: userData.employee_full_name,
    has_work_experience: helperMethods.convertToBoolean(
      userData.has_work_experience,
    ),
    position: userData.positionCode,
    isOfficer: userData.officer,
    is_license: helperMethods.convertToBoolean(userData.is_license),
    access_rights: {
      has_pis_access: await getPISAccess(userData.department_code),
      is_pis_approver: await getApproverAccess(
        userData.employee_id,
        moduleName1,
        appName,
      ),
      is_leave_approver: await getApproverAccess(
        userData.employee_id,
        moduleName2,
        appName,
      ),
    },
  };

  const generatedToken = helpers.generateAccessToken(user);

  return generatedToken;
}

function matchPassword(enteredPassword, correctPassword) {
  return md5(enteredPassword.trim()) === correctPassword.trim();
}

async function getPISAccess(condition) {
  const response = await sqlHelper.query(
    `SELECT COALESCE(G.HasAccess, 0) AS 'HasAccess'
    FROM UERMMMC..SECTIONS AS S
    LEFT JOIN HR..PISAccessRightGroups AS G
    ON G.GroupName = S.[Group]
    WHERE S.Code = ?;
      `,
    [condition],
  );
  const result = response[0].hasAccess;
  return (result === 1) ? true : false;
}

module.exports = {
  getDetails,
  matchPassword,
  getToken,
};
