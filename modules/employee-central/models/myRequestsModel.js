const otherRequestsModel = require("./otherRequestsModel.js");
const helperMethods = require("../utility/helperMethods.js");

async function get(employeeID, dateRangeSearch) {
  const myRequests = dateRangeSearch.my_requests;

  return {
    minimum_date_with_pending_request: await getMinimumDateWithPendingRequest(employeeID),
    pending: await getPending(employeeID, myRequests.pending.date_from, myRequests.pending.date_to),
    approved: await getApproved(employeeID, myRequests.approved.date_from, myRequests.approved.date_to),
  }
}

async function getPending(employeeID, dateFrom, dateTo) {
  let query = `SELECT DISTINCT
                  (
                  CAST((SELECT COUNT(*) FROM [UE database]..RequestDtl 
                  WHERE CurrentStatus = 0 AND ApprovedBy IS NULL 
                  AND DateTimeApproved IS NULL AND H.CreatedBy = @EmployeeID 
				          AND RequestHdrID = H.ID)
                  AS VARCHAR(MAX))
                  + '/' +
                  CAST((SELECT COUNT(*) FROM [UE database]..RequestDtl WHERE RequestHdrID = H.ID) AS VARCHAR(MAX))
                  ) AS 'stats',
                  H.ID AS 'request_id', 
                  CASE
                  WHEN H.RequestType = 0 THEN 'edit'
                  WHEN H.RequestType = 1 THEN 'create'
                  END AS 'request_type',
                  TRIM(E.LastName + ', ' + E.FirstName + ' ' + LEFT(E.MiddleName, 1) + '. ' + E.ExtName) AS 'created_by',
                  H.DateTimeCreated AS 'date_time_created',
                  H.ShouldHighlightedToRequester AS 'should_high_lighted_to_requester',
                  '' AS 'requested_fields',
                  '' AS 'details',
                  '' AS 'description'
                  FROM [UE database]..RequestHdr AS H
                  INNER JOIN [UE database]..RequestDtl AS D
                  ON D.RequestHdrID = H.ID
                  INNER JOIN [UE database]..Employee AS E
                  ON H.CreatedBy = E.EmployeeCode
                  WHERE D.CurrentStatus = 0
                  AND D.ApprovedBy IS NULL
                  AND D.DateTimeApproved IS NULL
                  AND H.CreatedBy = @EmployeeID
                  AND H.DateTimeCreated BETWEEN @DateFrom AND DATEADD(DAY, 1, @DateTo)
                  ORDER BY H.DateTimeCreated DESC`;

  const parameters = [
    { name: "EmployeeID", dataType: "VarChar", value: employeeID },
    { name: "DateFrom", dataType: "Date", value: dateFrom },
    { name: "DateTo", dataType: "Date", value: dateTo }
  ];

  const requestHdr = (await helperMethods.executeQuery(query, parameters)).recordset;

  let response;

  for (const index in requestHdr) {

    query = `SELECT DISTINCT
    ISNULL(TRIM(F.FullName), '') AS 'sibling_or_child_full_name',
    D.FamilyRecno AS 'family_id',
    D.PersonQueueNumber AS 'person_queue_number'
    FROM RequestDtl AS D
    LEFT JOIN Family AS F
    ON D.FamilyRecno = F.Recno
    WHERE D.RequestHdrID = @RequestHdrID`;

    const parameters = [
      { name: "RequestHdrID", dataType: "Int", value: requestHdr[index].request_id }
    ];

    response = await helperMethods.executeQuery(query, parameters);
    const totalLength = response.recordset.length;
    requestHdr[index].are_siblings_or_children = (totalLength > 1) ? true : false;

    const result = response.recordset;
    const dtl = [];
    for (const item of result) {
      // ------------------------------------------------- CREATE -------------------------------------------------
      if (requestHdr[index].request_type === 'create' && item.family_id === null) {
        query = `SELECT 
        D.ID AS 'id',
        TRIM(D.ColumnName) AS 'column_name',
        TRIM(D.NewValue) AS 'value',
        D.HRRemarks AS 'hr_remarks',
        TRIM(E.LastName + ', ' + E.FirstName + ' ' + LEFT(E.MiddleName, 1) + '. ' + E.ExtName) AS 'remarks_by',
        D.DateTimeRemarks AS 'date_time_remarks',
        D.IsComplied AS 'is_complied'
        FROM [UE database]..RequestDtl AS D
        LEFT JOIN [UE database]..Employee AS E
        ON D.RemarksBy = E.EmployeeCode 
        WHERE D.RequestHdrID = @RequestHdrID
        AND D.CurrentStatus = 0
        AND D.ApprovedBy IS NULL
        AND D.DateTimeApproved IS NULL`;

        if (item.person_queue_number !== null) query += " AND D.PersonQueueNumber = @PersonQueueNumber";
        query += " ORDER BY D.ID ASC";

        const parameters = [
          { name: "RequestHdrID", dataType: "Int", value: requestHdr[index].request_id }
        ];

        if (item.person_queue_number !== null) parameters.push({ name: "PersonQueueNumber", dataType: "Int", value: item.person_queue_number });

        response = await helperMethods.executeQuery(query, parameters);

        if (response.recordset.length > 0) {
          if  (totalLength > 1)  dtl.push({ table_rows: await otherRequestsModel.renameColumnName(response.recordset) });
          requestHdr[index].details = (totalLength > 1) ? dtl : await otherRequestsModel.renameColumnName(response.recordset);
        }
      }
      // ------------------------------------------------- CREATE -------------------------------------------------
      // ------------------------------------------------- EDIT -------------------------------------------------
      else if (requestHdr[index].request_type === 'edit' && item.person_queue_number === null) {
        query = `SELECT 
                  D.ID AS 'id',
                  TRIM(D.ColumnName) AS 'column_name',
                  TRIM(D.OldValue) AS 'from',
                  TRIM(D.NewValue) AS 'to',
                  D.HRRemarks AS 'hr_remarks',
                  TRIM(E.LastName + ', ' + E.FirstName + ' ' + LEFT(E.MiddleName, 1) + '. ' + E.ExtName) AS 'remarks_by',
                  D.DateTimeRemarks AS 'date_time_remarks',
                  D.IsComplied AS 'is_complied'
                  FROM [UE database]..RequestDtl AS D
                  LEFT JOIN [UE database]..Employee AS E
                  ON D.RemarksBy = E.EmployeeCode
                  WHERE D.RequestHdrID = @RequestHdrID
                  AND D.CurrentStatus = 0
                  AND D.ApprovedBy IS NULL
                  AND D.DateTimeApproved IS NULL`;


        if (item.family_id !== null) query += " AND D.FamilyRecno = @FamilyRecno";
        query += " ORDER BY D.ID ASC";

        const parameters = [
          { name: "RequestHdrID", dataType: "Int", value: requestHdr[index].request_id }
        ];

        if (item.family_id !== null) parameters.push({ name: "FamilyRecno", dataType: "Int", value: item.family_id });

        response = await helperMethods.executeQuery(query, parameters);

        if (response.recordset.length > 0) {
          if  (totalLength > 1) {
          const obj = {
            sibling_or_child_full_name: item.sibling_or_child_full_name,
            table_rows: await otherRequestsModel.renameColumnName(response.recordset)
          };
          dtl.push(obj);
         }
          requestHdr[index].details = (totalLength > 1) ? dtl : await otherRequestsModel.renameColumnName(response.recordset);
        }
      }
      // ------------------------------------------------- EDIT -------------------------------------------------
      else throw 'Invalid request type in getPending()';
    }

    requestHdr[index].description = await otherRequestsModel.getDescription(requestHdr[index].created_by, requestHdr[index].request_id);
    const statusID = 0;
    requestHdr[index].requested_fields = await otherRequestsModel.getRequestedFields(requestHdr[index].request_id, statusID);
  }

  return requestHdr;
}

async function getApproved(employeeID, dateFrom, dateTo) {
  let query = `SELECT DISTINCT
                  (
                  CAST((SELECT COUNT(*) FROM [UE database]..RequestDtl 
                  WHERE CurrentStatus = 1 AND ApprovedBy IS NOT NULL 
                  AND DateTimeApproved IS NOT NULL AND H.CreatedBy = @EmployeeID
                  AND RequestHdrID = H.ID)
                  AS VARCHAR(MAX))
                  + '/' +
                  CAST((SELECT COUNT(*) FROM [UE database]..RequestDtl WHERE RequestHdrID = H.ID) AS VARCHAR(MAX))
                  ) AS 'stats',
                  H.ID AS 'request_id', 
                  CASE
                  WHEN H.RequestType = 0 THEN 'edit'
                  WHEN H.RequestType = 1 THEN 'create'
                  END AS 'request_type',
                  TRIM(E.LastName + ', ' + E.FirstName + ' ' + LEFT(E.MiddleName, 1) + '. ' + E.ExtName) AS 'created_by',
                  H.DateTimeCreated AS 'date_time_created',
                  '' AS 'requested_fields',
                  '' AS 'details'
                  FROM [UE database]..RequestHdr AS H
                  INNER JOIN [UE database]..RequestDtl AS D
                  ON D.RequestHdrID = H.ID
                  INNER JOIN [UE database]..Employee AS E
                  ON H.CreatedBy = E.EmployeeCode
                  WHERE D.CurrentStatus = 1
                  AND D.ApprovedBy IS NOT NULL
                  AND D.DateTimeApproved IS NOT NULL
                  AND H.CreatedBy = @EmployeeID
                  AND H.DateTimeCreated BETWEEN @DateFrom AND DATEADD(DAY, 1, @DateTo)
                  ORDER BY H.DateTimeCreated DESC`;

  const parameters = [
    { name: "EmployeeID", dataType: "VarChar", value: employeeID },
    { name: "DateFrom", dataType: "Date", value: dateFrom },
    { name: "DateTo", dataType: "Date", value: dateTo }
  ];

  const requestHdr = (await helperMethods.executeQuery(query, parameters)).recordset;

  for (const index in requestHdr) {

    query = `SELECT DISTINCT
    ISNULL(TRIM(F.FullName), '') AS 'sibling_or_child_full_name',
    D.FamilyRecno AS 'family_id',
    D.PersonQueueNumber AS 'person_queue_number'
    FROM RequestDtl AS D
    LEFT JOIN Family AS F
    ON D.FamilyRecno = F.Recno
    WHERE D.RequestHdrID = @RequestHdrID`;

    const parameters = [
      { name: "RequestHdrID", dataType: "Int", value: requestHdr[index].request_id }
    ];

    let response = await helperMethods.executeQuery(query, parameters);

    const totalLength = response.recordset.length;
    requestHdr[index].are_siblings_or_children = (totalLength > 1) ? true : false;

    const result = response.recordset;
    const dtl = [];
    for (const item of result) {
      // ------------------------------------------------- CREATE -------------------------------------------------
      if (requestHdr[index].request_type === 'create' && item.family_id === null) {
        query = `SELECT 
        D.ID AS 'id',
        D.DateTimeApproved AS 'date_time_approved',
        TRIM(E.LastName + ', ' + E.FirstName + ' ' + LEFT(E.MiddleName, 1) + '. ' + E.ExtName) AS 'approved_by',
        TRIM(D.ColumnName) AS 'column_name',
        TRIM(D.NewValue) AS 'value'
        FROM RequestDtl AS D
        INNER JOIN [UE database]..Employee AS E
        ON D.ApprovedBy = E.EmployeeCode
        WHERE D.RequestHdrID = @RequestHdrID
        AND D.CurrentStatus = 1
        AND D.ApprovedBy IS NOT NULL
        AND D.DateTimeApproved IS NOT NULL`;

        if (item.person_queue_number !== null) query += " AND D.PersonQueueNumber = @PersonQueueNumber";
        query += " ORDER BY D.DateTimeApproved ASC";

        const parameters = [
          { name: "RequestHdrID", dataType: "Int", value: requestHdr[index].request_id }
        ];

        if (item.person_queue_number !== null) parameters.push({ name: "PersonQueueNumber", dataType: "Int", value: item.person_queue_number });

        response = await helperMethods.executeQuery(query, parameters);

        if (response.recordset.length > 0) {
         if (totalLength > 1) { 
          const obj = {
            table_rows: await otherRequestsModel.renameColumnName(response.recordset)
          };
          dtl.push(obj);
        }
          requestHdr[index].details = (totalLength > 1) ? dtl : await otherRequestsModel.renameColumnName(response.recordset);
        }
      }
      // ------------------------------------------------- CREATE -------------------------------------------------
      // ------------------------------------------------- EDIT -------------------------------------------------
      else if (requestHdr[index].request_type === 'edit' && item.person_queue_number === null) {
        query = `SELECT 
        D.ID AS 'id',
        D.DateTimeApproved AS 'date_time_approved',
        TRIM(E.LastName + ', ' + E.FirstName + ' ' + LEFT(E.MiddleName, 1) + '. ' + E.ExtName) AS 'approved_by',
        TRIM(D.ColumnName) AS 'column_name',
        TRIM(D.OldValue) AS 'from',
        TRIM(D.NewValue) AS 'to'
        FROM RequestDtl AS D
        INNER JOIN [UE database]..Employee AS E
        ON D.ApprovedBy = E.EmployeeCode
        WHERE D.RequestHdrID = @RequestHdrID
        AND D.CurrentStatus = 1
        AND D.ApprovedBy IS NOT NULL
        AND D.DateTimeApproved IS NOT NULL`;


        if (item.family_id !== null) query += " AND D.FamilyRecno = @FamilyRecno";
        query += " ORDER BY D.DateTimeApproved ASC";

        const parameters = [
          { name: "RequestHdrID", dataType: "Int", value: requestHdr[index].request_id }
        ];

        if (item.family_id !== null) parameters.push({ name: "FamilyRecno", dataType: "Int", value: item.family_id });

        response = await helperMethods.executeQuery(query, parameters);

        if (response.recordset.length > 0) {
          if  (totalLength > 1) {
          const obj = {
            sibling_or_child_full_name: item.sibling_or_child_full_name,
            table_rows: await otherRequestsModel.renameColumnName(response.recordset)
          };
          dtl.push(obj);
         }
          requestHdr[index].details = (totalLength > 1) ? dtl : await otherRequestsModel.renameColumnName(response.recordset);
        }
      }
      // ------------------------------------------------- EDIT -------------------------------------------------
      else {
        throw 'Invalid request type in getApproved()';
      }

    }

    requestHdr[index].description = await otherRequestsModel.getDescription(requestHdr[index].created_by, requestHdr[index].request_id);
    const statusID = 1;
    requestHdr[index].requested_fields = await otherRequestsModel.getRequestedFields(requestHdr[index].request_id, statusID);
  }

  return requestHdr;
}

async function submitComply(data) {
  let transaction;
  try {

    let newValue;

    if (typeof data.value !== 'object') newValue = data.value.toString();

    transaction = await helperMethods.beginTransaction();

    let query = `UPDATE [UE database]..RequestDtl 
                 SET `

    if (typeof data.value !== 'object') query += `NewValue = @NewValue, `

    query += `IsComplied = 1 WHERE ID = @ID`;

    let parameters = [{ name: "ID", dataType: "Int", value: data.request_details_id }];

    if (typeof data.value !== 'object') parameters.push({ name: "NewValue", dataType: "VarChar", value: newValue });

    let response = await helperMethods.executeQuery(query, parameters, transaction);
    if (response.rowsAffected[0] === 0) throw "No rows affected";

    query = `SELECT TOP 1 
    RequestHdrID,
    ColumnName
    FROM [UE database]..RequestDtl
    WHERE ID = @ID`;

    parameters = [
      { name: "ID", dataType: "Int", value: data.request_details_id }
    ];

    response = await helperMethods.executeQuery(query, parameters, transaction);

    const requestHdrID = response.recordset[0].RequestHdrID;
    const columnName = response.recordset[0].ColumnName;

    query = `UPDATE [UE database]..RequestHdr 
      SET ShouldHighlightedToHR = 1
      WHERE ID = @ID`;

    parameters = [
      { name: "ID", dataType: "Int", value: requestHdrID }
    ];

    response = await helperMethods.executeQuery(query, parameters, transaction);
    if (response.rowsAffected[0] === 0) throw "No rows affected";

    if (columnName === "TrainingOrSeminarName")
      await rename(transaction, requestHdrID, newValue, 'TRAINING OR SEMINAR CERTIFICATE');


    if (columnName.includes("CurrentAddress_") || columnName.includes("PermanentAddress_"))
      await updateColumnPermanentAddressIsSameAsCurrentAddress(transaction, requestHdrID);

    await helperMethods.commitTransaction(transaction);
  } catch (error) {
    await helperMethods.rollbackTransaction(transaction);
    throw error;
  }
}

async function updateColumnPermanentAddressIsSameAsCurrentAddress(transaction, requestHdrID) {
  const currentAddressDetails = [];
  const permanentAddressDetails = [];

  let details = await getCurrentAddressOrPermanentAddressDetails(transaction, requestHdrID, "CurrentAddress_");
  for (const item of details) {
    currentAddressDetails.push(item.NewValue);
  }

  details = await getCurrentAddressOrPermanentAddressDetails(transaction, requestHdrID, "PermanentAddress_");
  for (const item of details) {
    permanentAddressDetails.push(item.NewValue);
  }

  const isCurrentAddressAndPermanentAddressMatched = isDetailsMatch(currentAddressDetails, permanentAddressDetails);

  const query = `UPDATE [UE database]..RequestDtl 
      SET NewValue = @NewValue
      WHERE RequestHdrID = @RequestHdrID 
      AND ColumnName = 'PermanentAddress_IsSameAsCurrentAddress'`;

  const parameters = [
    { name: "RequestHdrID", dataType: "Int", value: requestHdrID },
    { name: "NewValue", dataType: "VarChar", value: isCurrentAddressAndPermanentAddressMatched.toString().toUpperCase() },
  ];

 const response = await helperMethods.executeQuery(query, parameters, transaction);
  if (response.rowsAffected[0] === 0) throw "No rows affected";
}

async function getCurrentAddressOrPermanentAddressDetails(transaction, requestHdrID, columnName) {
  const query = `SELECT 
  TRIM(NewValue) AS 'NewValue' 
  FROM [UE database]..RequestDtl 
  WHERE RequestHdrID = @ID AND ColumnName LIKE @ColumnName
  AND ColumnName != 'PermanentAddress_IsSameAsCurrentAddress' 
  ORDER BY ColumnName ASC`;

  const parameters = [
    { name: "ID", dataType: "Int", value: requestHdrID },
    { name: "ColumnName", dataType: "VarChar", value: `%${  columnName  }%` },
  ];

 const response = await helperMethods.executeQuery(query, parameters, transaction);
  return response.recordset;
}

function isDetailsMatch(currentAddressDetails, permanentAddressDetails) {
  if (currentAddressDetails.length !== permanentAddressDetails.length) return false;

  for (let i = 0; i < currentAddressDetails.length; i++) {
    // If any elements don't match, return false
    if (currentAddressDetails[i] !== permanentAddressDetails[i]) return false;
  }

  // If all elements match, return true
  return true;
}

async function rename(transaction, requestHDRID, newValue, columnValue) {
    let query = `SELECT TOP 1 
    ID,
    NewValue
    FROM [UE database]..RequestDtl
    WHERE RequestHdrID = @RequestHdrID
    AND ColumnName = @ColumnValue`;

    let parameters = [
      { name: "RequestHdrID", dataType: "Int", value: requestHDRID },
      { name: "ColumnValue", dataType: "VarChar", value: columnValue },
    ];

    let response = await helperMethods.executeQuery(query, parameters, transaction);

    const id = response.recordset[0].ID;
    const currentValue = response.recordset[0].NewValue.trim();

    const newCertificate = `${newValue.trim()  }.pdf`;

    query = `UPDATE [UE database]..RequestDtl 
      SET NewValue = @NewValue
      WHERE ID = @ID`;

    parameters = [
      { name: "NewValue", dataType: "VarChar", value: newCertificate },
      { name: "ID", dataType: "Int", value: id },
    ];

    response = await helperMethods.executeQuery(query, parameters, transaction);
    if (response.rowsAffected[0] === 0) throw "No rows affected";

    const uploadedFolderPath = helperMethods.getUploadedFolderPath();
    const fullPath = `${uploadedFolderPath  }/requests/pending/${  requestHDRID  }/value/${  currentValue}`;

    await helperMethods.renameFile(fullPath, newCertificate);
}

async function requestNotHighLightedToRequester(requestID) {
  const query = `UPDATE [UE DATABASE]..RequestHdr 
                 SET ShouldHighlightedToRequester = 0 
                 WHERE ID = @ID`;

  const parameters = [
    { name: "ID", dataType: "Int", value: requestID }
  ];

  const response = await helperMethods.executeQuery(query, parameters);
  if (response.rowsAffected[0] === 0) throw "No rows affected";
}

async function getMinimumDateWithPendingRequest(employeeID) {
  const query = `SELECT TOP 1 
  CAST(H.DateTimeCreated AS DATE) AS 'DateTimeCreated'
  FROM [UE database]..RequestHdr AS H
  INNER JOIN [UE database]..RequestDtl AS D
  ON H.ID = D.RequestHdrID
  WHERE D.ApprovedBy IS NULL AND D.DateTimeApproved IS NULL 
  AND H.CreatedBy = @EmployeeID
  ORDER BY H.DateTimeCreated ASC`;

  const parameters = [
    { name: "EmployeeID", dataType: "Int", value: employeeID }
  ];

  const response = await helperMethods.executeQuery(query, parameters);
  return (response.recordset[0] !== undefined) ? response.recordset[0].DateTimeCreated : '1900-01-01';
}

function getID(requestDtlID) {
  if (Number(requestDtlID) === 0) return requestDtlID;
  return Number(requestDtlID) - 1;
}

async function getAllProvinces(requestDtlID) {
  const id = getID(requestDtlID);
  let query = `SELECT TOP 1 
  NewValue AS 'RegionCode' 
  FROM [UE database]..RequestDtl WHERE ID = @ID`;

  let parameters = [{ name: "ID", dataType: "Int", value: id }];

  let response = await helperMethods.executeQuery(query, parameters);

  const regionCode = response.recordset[0].RegionCode;

  query = `SELECT 
               TRIM(CODE) AS 'province_code', 
               TRIM(UPPER([NAME])) AS 'province_name'
               FROM UERMHIMS..CodeProvince
               WHERE LEFT(Code, 2) = LEFT(@RegionCode, 2)
               ORDER BY [NAME] ASC`;

  parameters = [{ name: "RegionCode", dataType: "VarChar", value: regionCode }];
  response = await helperMethods.executeQuery(query, parameters);
  return response.recordset;
}

async function getAllCitiesOrMunicipalities(requestDtlID) {
  const id = getID(requestDtlID);
  let query = `SELECT TOP 1 
                NewValue AS 'ProvinceCode' 
                FROM [UE database]..RequestDtl 
                WHERE ID = @ID`;

  let parameters = [{ name: "ID", dataType: "Int", value: id }];

  let response = await helperMethods.executeQuery(query, parameters);

  const provinceCode = response.recordset[0].ProvinceCode;

  query = `SELECT 
               TRIM(CODE) AS 'city_or_municipality_code', 
               TRIM(UPPER([NAME])) AS 'city_or_municipality_name'
               FROM UERMHIMS..CodeMunicipalityCity
               WHERE Code != '133900000' 
               AND LEFT(Code, 4) = LEFT(@ProvinceCode, 4)
               ORDER BY [NAME] ASC`;

  parameters = [{ name: "ProvinceCode", dataType: "VarChar", value: provinceCode }];
  response = await helperMethods.executeQuery(query, parameters);
  return response.recordset;
}

async function getAllMajors(requestDtlID) {
  const id = getID(requestDtlID);
  let query = `SELECT TOP 1 
  NewValue AS 'CourseID' 
  FROM [UE database]..RequestDtl WHERE ID = @ID`;

  let parameters = [{ name: "ID", dataType: "Int", value: id }];

  let response = await helperMethods.executeQuery(query, parameters);

  const courseID = response.recordset[0].CourseID;

  query = `SELECT 
               ID AS 'major_id',
               TRIM([Description]) AS 'major_name'
            FROM HR..CollegeMajors
            WHERE CollegeCourseID = @CourseID
            ORDER BY [Description] ASC`;

  parameters = [{ name: "CourseID", dataType: "Int", value: courseID }];

  response = await helperMethods.executeQuery(query, parameters);
  return response.recordset;
}

module.exports = {
  get,
  submitComply,
  requestNotHighLightedToRequester,
  getAllProvinces,
  getAllCitiesOrMunicipalities,
  getAllMajors
}