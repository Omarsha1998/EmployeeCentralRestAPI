const helperMethods = require("../utility/helperMethods.js");
const uploadsModel = require("../models/uploadsModel.js");

async function get(employeeID, token) {
  let url = `${helperMethods.getURL()  }/${process.env.EC_EJS_VIEWS_FOLDER}/uploads/get-current-prc-id?token=${  token}`;
  url += "&licenseName=";
  url = url.trim();

 let query = `UPDATE L 
              SET L.IsLatestLicenseUploaded = 0
              FROM [UE database]..License AS L
              WHERE L.EmployeeCode = @EmployeeCode
              AND L.PrcLicense = 1 
              AND L.ExpirationDate <= CAST(GETDATE() AS DATE)
              AND L.IsLatestLicenseUploaded = 1
              AND (
                    (SELECT TOP 1 
                    CurrentStatus 
                    FROM [UE database]..RequestDtl AS D 
                    INNER JOIN [UE database]..RequestHdr AS H
                    ON H.ID = D.RequestHdrID
                    WHERE TRIM(D.ColumnName) = 'PRC ID' AND TRIM(H.LicenseNo) = TRIM(L.LicenseNo)
                    )
                  = 1)`;

   let parameters = [{ name: "EmployeeCode", dataType: "VarChar", value: employeeID }];

   await helperMethods.executeQuery(query, parameters);

   query = `SELECT
            ISNULL(TRIM(License), '') AS 'license_name',
            ISNULL(TRIM(LicenseNo), '') AS 'license_no',
            ISNULL(Rate, 0) AS 'rate',
            ISNULL(TRIM(YearTaken), '') AS 'year_taken',
            ISNULL(ExpirationDate, '') AS 'expiration_date',
            ISNULL(DateTimeUpdated, '') AS 'date_time_updated',
            @URL + TRIM(License) AS 'url',
            ISNULL(IsLatestLicenseUploaded, 0) AS 'is_latest_license_uploaded',
            Recno AS 'rec_no'
            FROM [UE database]..License
            WHERE EmployeeCode = @EmployeeID AND PrcLicense = 1
            ORDER BY YearTaken DESC`;

 parameters = [
    { name: "EmployeeID", dataType: "VarChar", value: employeeID },
    { name: "URL", dataType: "VarChar", value: url }
  ];

  return (await helperMethods.executeQuery(query, parameters)).recordset;
}

async function getExpirationDate(employeeID, licenseNo) {
  const query = `SELECT TOP 1
  ISNULL(ExpirationDate, '') AS 'expiration_date'
  FROM [UE database]..License
  WHERE EmployeeCode = @EmployeeID 
  AND LicenseNo = @LicenseNo AND PrcLicense = 1`;

  const parameters = [
    { name: "EmployeeID", dataType: "VarChar", value: employeeID },
    { name: "LicenseNo", dataType: "VarChar", value: licenseNo }
  ];

  const response = await helperMethods.executeQuery(query, parameters);
  return response.recordset[0].expiration_date;
}

async function isLicensedEmployee(employeeID) {
  const query = `SELECT TOP 1 EmployeeCode 
               FROM [UE database]..License 
               WHERE EmployeeCode = @EmployeeID`;

  const parameters = [
    { name: "EmployeeID", dataType: "VarChar", value: employeeID }
  ];

  const response = await helperMethods.executeQuery(query, parameters);
  const length = response.recordset.length;
  return (length > 0) ? true : false;
}

async function isExpired(employeeID) {
  const query = ` SELECT TOP 1 EmployeeCode
                FROM [UE database]..License 
                WHERE EmployeeCode = @EmployeeID 
                AND
                ExpirationDate < CAST(GETDATE() as DATE)`;

  const parameters = [
    { name: "EmployeeID", dataType: "VarChar", value: employeeID }
  ];

  const response = await helperMethods.executeQuery(query, parameters);
  const length = response.recordset.length;
  return (length > 0 ? true : false);
}

async function isAllExpired(employeeID) {
  let query = `SELECT COUNT(*) AS 'total_licenses' 
               FROM [UE database]..License
               WHERE EmployeeCode = @EmployeeID`;

  const parameters = [
    { name: "EmployeeID", dataType: "VarChar", value: employeeID }
  ];

  let response = await helperMethods.executeQuery(query, parameters);
  const totalLicenses = response.recordset[0].total_licenses;

  query = `SELECT COUNT(*) AS 'total_expired_licenses'
           FROM [UE database]..License 
           WHERE EmployeeCode = @EmployeeID 
           AND ExpirationDate < CAST(GETDATE() as DATE)`;

  response = await helperMethods.executeQuery(query, parameters);
  const totalExpiredLicenses = response.recordset[0].total_expired_licenses;
  return (totalLicenses === totalExpiredLicenses) ? true : false;
}

async function createRequest(data) {
  let transaction;
  try {
    transaction = await helperMethods.beginTransaction();
    const createdBy = data.employee_id;
    const destinationTable = "License";
    const requestType = 0; // 0 = Edit

    let query = `INSERT INTO [UE database]..RequestHdr 
             (CreatedBy, DateTimeCreated, DestinationTable, RequestType, LicenseNo)
             VALUES 
             (@CreatedBy, GETDATE(), @DestinationTable, @RequestType, @LicenseNo)`;

    let parameters = [
      { name: "CreatedBy", dataType: "VarChar", value: createdBy },
      { name: "DestinationTable", dataType: "VarChar", value: destinationTable },
      { name: "RequestType", dataType: "SmallInt", value: requestType },
      { name: "LicenseNo", dataType: "VarChar", value: data.license_no }
    ];

    let response = await helperMethods.executeQuery(query, parameters, transaction);
    if (response.rowsAffected[0] === 0) throw "No rows affected";

    query = `SELECT TOP 1
             ID AS 'id' 
             FROM [UE database]..RequestHdr
             ORDER BY DateTimeCreated DESC`;

    response = await helperMethods.executeQuery(query, null, transaction);
    const requestID = response.recordset[0].id;

    const currentExpirationDate = helperMethods.removeTime(data.current_expiration_date);
    const newExpirationDate = data.new_expiration_date;

    query = `INSERT INTO [UE database]..RequestDtl 
             (RequestHdrID, ColumnName, OldValue, NewValue)
             VALUES 
             (@RequestHdrID, @ColumnName, @OldValue, @NewValue)`;

    parameters = [
      { name: "RequestHdrID", dataType: "Int", value: requestID },
      { name: "ColumnName", dataType: "VarChar", value: "ExpirationDate" },
      { name: "OldValue", dataType: "VarChar", value: (currentExpirationDate === '1900-01-01' ? null : currentExpirationDate) },
      { name: "NewValue", dataType: "VarChar", value: newExpirationDate }
    ];

    response = await helperMethods.executeQuery(query, parameters, transaction);
    if (response.rowsAffected[0] === 0) throw "No rows affected";

    let currentCurrentPRCIDFileName = "";
    const resultPath = await uploadsModel.getCurrentPRCID(createdBy, data.license_name);
    if (resultPath !== "") {
      const array = resultPath.split("/");
      const lastIndex = array.length - 1;
      currentCurrentPRCIDFileName = array[lastIndex];
      currentCurrentPRCIDFileName.trim();
    }

    const newValue = `${data.license_name  }.${  data.attach_prc_id.split('.').pop()}`;

    query = "INSERT INTO [UE database]..RequestDtl (RequestHdrID, ColumnName, "
    query += (currentCurrentPRCIDFileName === "") ? "NewValue)" : "OldValue, NewValue)";
    query += " VALUES (@RequestHdrID, @ColumnName, ";
    query += (currentCurrentPRCIDFileName === "") ? "@NewValue)" : "@OldValue, @NewValue)";

    parameters = [
      { name: "RequestHdrID", dataType: "Int", value: requestID },
      { name: "ColumnName", dataType: "VarChar", value: "PRC ID" }
    ];

    if (currentCurrentPRCIDFileName !== "") parameters.push({ name: "OldValue", dataType: "VarChar", value: currentCurrentPRCIDFileName });
    parameters.push({ name: "NewValue", dataType: "VarChar", value: newValue });

    response = await helperMethods.executeQuery(query, parameters, transaction);
    if (response.rowsAffected[0] === 0) throw "No rows affected";


    query = `UPDATE [UE database]..License 
             SET IsLatestLicenseUploaded = 1
             WHERE Recno = @RecNo AND EmployeeCode = @EmployeeCode`;

    parameters = [
      { name: "RecNo", dataType: "Int", value: data.rec_no },
      { name: "EmployeeCode", dataType: "VarChar", value: createdBy },
    ];
    
    response = await helperMethods.executeQuery(query, parameters, transaction);
    if (response.rowsAffected[0] === 0) throw "No rows affected";


    await helperMethods.commitTransaction(transaction);
    return requestID
  } catch (error) {
    await helperMethods.rollbackTransaction(transaction);
    throw error;
  }
}

module.exports = {
  isLicensedEmployee,
  isExpired,
  createRequest,
  get,
  getExpirationDate,
  isAllExpired,
}