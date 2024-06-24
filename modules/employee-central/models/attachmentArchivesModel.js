const helperMethods = require("../utility/helperMethods.js");
const helpers = require("../../../helpers/crypto.js");

async function getAllDepartments() {
  const query = `SELECT 
    DeptCode AS 'department_id', 
    [Description] AS 'department_name'
    FROM [UE database]..Department 
    WHERE College = '' AND DeptCode != 'N/A'
    ORDER BY [Description] ASC`;
  return (await helperMethods.executeQuery(query)).recordset;
}

async function searchEmployee(departmentID, employeeIDOrEmployeeName) {
  let query = `SELECT 
                  E.EmployeeCode AS 'employee_id',
                  E.LastName AS 'last_name',
                  E.FirstName AS 'first_name',
                  E.MiddleName AS 'middle_name',
                  D.[Description] AS 'department'
                  FROM [UE database]..Employee AS E
                  INNER JOIN [UE database]..Department AS D
                  ON E.DeptCode = D.DeptCode 
                  WHERE `;

  if (departmentID !== '0') query += ` D.DeptCode = @DepartmentID AND `;

  query += `(E.EmployeeCode = @EmployeeID)
                  OR (E.LastName LIKE @EmployeeName OR E.FirstName LIKE @EmployeeName OR E.MiddleName LIKE @EmployeeName) `;


  query += `ORDER BY E.LastName ASC`;

  const parameters = [
    { name: "EmployeeID", dataType: "VarChar", value: employeeIDOrEmployeeName },
    { name: "EmployeeName", dataType: "VarChar", value: `%${  employeeIDOrEmployeeName  }%` },
  ];

  if (departmentID !== "0") parameters.push({ name: "DepartmentID", dataType: "VarChar", value: departmentID });

  return (await helperMethods.executeQuery(query, parameters)).recordset;
}

async function getTotalPRCIDs(employeeID) {
  // PRC ID (LICENSE)
  const query = `SELECT  
   COUNT(EmployeeCode) AS 'total'
   FROM [UE database]..License 
   WHERE EmployeeCode = @EmployeeID AND ExpirationDate IS NOT NULL`;
  return await getResponse(query, employeeID);
}

async function getTotalBirthCertificates(employeeID) {
  // BIRTH CERTIFICATE (FOR CHILDREN)
  const query = `SELECT COUNT(Recno) AS 'total' 
  FROM [UE database]..Family
  WHERE EmployeeCode = @EmployeeID  AND FamType = 'Child' AND HasAttachment = 1`;
  return await getResponse(query, employeeID);
}

async function getTotalMarriageCertificates(employeeID) {
  // MARRIAGE CERTIFICATE (FOR SPOUSE)
  const query = `SELECT 
  COUNT(Recno) AS 'total'
  FROM [UE database]..Family
  WHERE EmployeeCode = @EmployeeID  AND FamType = 'Spouse' AND HasAttachment = 1`;
  return await getResponse(query, employeeID);
}

async function getTotalTORs(employeeID) {
  // TOR (EDUCATIONAL BACKGROUND)
  const query = `SELECT 
  COUNT(EmployeeCode) AS 'total'
  FROM [UE database]..Education
  WHERE EmployeeCode = @EmployeeID AND IsTranscriptSubmitted = 1 AND IsFinish = 1 AND HasAttachment = 1`;
  return await getResponse(query, employeeID);
}

async function getTotalDiplomas(employeeID) {
  // DIPLOMA (EDUCATIONAL BACKGROUND) 
  const query = `SELECT 
  COUNT(EmployeeCode) AS 'total'
  FROM [UE database]..Education
  WHERE EmployeeCode = @EmployeeID AND IsDiplomaSubmitted = 1 AND IsFinish = 1 AND HasAttachment = 1`;
  return await getResponse(query, employeeID);
}

async function getTotalTrainingsOrSeminars(employeeID) {
  // TRAINING/SEMINAR CERTIFICATE
  const query = `SELECT 
  COUNT(EmployeeCode) AS 'total'
  FROM HR..EmployeeCompletedTrainingOrSeminar
  WHERE EmployeeCode = @EmployeeID`;
  return await getResponse(query, employeeID);
}

async function getNamesAndLinksPRCIDs(employeeID, token) {
  const link = `${helperMethods.getURL()  }/${process.env.EC_EJS_VIEWS_FOLDER}/uploads/get-current-prc-id?token=${  token  }&licenseName=`;
  const query = `SELECT 
  License AS 'name',
  @LINK + TRIM(License) AS 'link'
  FROM [UE database]..License 
  WHERE EmployeeCode = @EmployeeID AND ExpirationDate IS NOT NULL`;

  return await getResponse(query, employeeID, link);
}

async function getNamesAndLinksBirthCertificates(employeeID, token) {
  const link = `${helperMethods.getURL()  }/${process.env.EC_EJS_VIEWS_FOLDER}/uploads/get-current-birth-certificate?token=${  token  }&fileName=`;
  const query = `SELECT 
  FullName AS 'name',
  @LINK + TRIM(FullName) AS 'link'
  FROM [UE database]..Family WHERE EmployeeCode = @EmployeeID AND FamType = 'Child' AND HasAttachment = 1`;

  return await getResponse(query, employeeID, link);
}

async function getNamesAndLinksMarriageCertificates(employeeID, token) {
  const link = `${helperMethods.getURL()  }/${process.env.EC_EJS_VIEWS_FOLDER}/uploads/get-current-marriage-certificate?token=${  token}`;
  const query = `SELECT 
  FullName AS 'name',
  @LINK AS 'link'
  FROM [UE database]..Family WHERE EmployeeCode = @EmployeeID AND FamType = 'Spouse' AND HasAttachment = 1`;

  return await getResponse(query, employeeID, link);
}

async function getNamesAndLinksTORs(employeeID, token) {
  const link = `${helperMethods.getURL()  }/${process.env.EC_EJS_VIEWS_FOLDER}/uploads/get-current-tor-or-diploma?token=${  token  }&diploma=`;
  const query = `SELECT 
  DiplomaDegreeHonor AS 'name',
  @LINK + TRIM(DiplomaDegreeHonor) + '&document=tor' AS 'link'
  FROM [UE database]..Education
  WHERE EmployeeCode = @EmployeeID AND IsTranscriptSubmitted = 1 AND IsFinish = 1 AND HasAttachment = 1`;

  return await getResponse(query, employeeID, link);
}

async function getNamesAndLinksDiplomas(employeeID, token) {
  const link = `${helperMethods.getURL()  }/${process.env.EC_EJS_VIEWS_FOLDER}/uploads/get-current-tor-or-diploma?token=${  token  }&diploma=`;
  const query = `SELECT 
  DiplomaDegreeHonor AS 'name',
  @LINK + TRIM(DiplomaDegreeHonor) + '&document=diploma' AS 'link'
  FROM [UE database]..Education
  WHERE EmployeeCode = @EmployeeID AND IsDiplomaSubmitted = 1 AND IsFinish = 1 AND HasAttachment = 1`;

  return await getResponse(query, employeeID, link);
}

async function getNamesAndLinksTrainingsOrSeminars(employeeID, token) {
  const link = `${helperMethods.getURL()  }/${process.env.EC_EJS_VIEWS_FOLDER}/uploads/get-current-training-or-seminar-certificate?token=${  token  }&trainingOrSeminarName=`;
  const query = `SELECT 
  TrainingOrSeminarName AS 'name',
  @LINK + TRIM(TrainingOrSeminarName) AS 'link'
  FROM HR..EmployeeCompletedTrainingOrSeminar WHERE EmployeeCode = @EmployeeID`;

  return await getResponse(query, employeeID, link);
}

async function getEmployeeAttachments(employeeID) {
  const user = { employee_id: employeeID };

  const token = helpers.generateAccessToken(user);

  const employeeAttachments = {
    totals: {
      prc_id: await getTotalPRCIDs(employeeID),
      birth_certificate: await getTotalBirthCertificates(employeeID),
      marriage_certificate: await getTotalMarriageCertificates(employeeID),
      tor: await getTotalTORs(employeeID),
      diploma: await getTotalDiplomas(employeeID),
      training_or_seminar: await getTotalTrainingsOrSeminars(employeeID),
    },
    names_and_links: {
      prc_id: await getNamesAndLinksPRCIDs(employeeID, token),
      birth_certificate: await getNamesAndLinksBirthCertificates(employeeID, token),
      marriage_certificate: await getNamesAndLinksMarriageCertificates(employeeID, token),
      tor: await getNamesAndLinksTORs(employeeID, token),
      diploma: await getNamesAndLinksDiplomas(employeeID, token),
      training_or_seminar: await getNamesAndLinksTrainingsOrSeminars(employeeID, token),
    }
  };

  return employeeAttachments;
}

async function getResponse(query, employeeID, link = '') {
  const parameters = [
    { name: "EmployeeID", dataType: "VarChar", value: employeeID }
  ];

  if (link !== "") parameters.push({ name: "LINK", dataType: "VarChar", value: link });

  const response = await helperMethods.executeQuery(query, parameters);

  return (link === "") ? response.recordset[0].total : response.recordset;
}



module.exports = {
  getAllDepartments,
  searchEmployee,
  getEmployeeAttachments
}