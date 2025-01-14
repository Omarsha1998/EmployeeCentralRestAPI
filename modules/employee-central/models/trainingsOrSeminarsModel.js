const helperMethods = require("../utility/helperMethods.js");

async function get(employeeID, token) {
  const query = `SELECT
  ISNULL(TRIM(TrainingOrSeminarName), '') AS 'training_or_seminar_name',
  ISNULL(TRIM(TrainingProvider), '') AS 'training_provider',  
  FromDate AS 'from_date', 
  ToDate AS 'to_date',
  ISNULL(TRIM(Venue), '') AS 'venue',
  '' AS 'attached_training_or_seminar_certificate'
  FROM HR..EmployeeCompletedTrainingOrSeminar
  WHERE EmployeeCode = @EmployeeID
  ORDER BY FromDate DESC`;

  const parameters = [{ name: "EmployeeID", dataType: "VarChar", value: employeeID }];
  const response = await helperMethods.executeQuery(query, parameters);
  const records = response.recordset;

  for (let i = 0; i < records.length; i++) {
    const trainingOrSeminarName = records[i].training_or_seminar_name;
    const uploadedFolderPath = helperMethods.getUploadedFolderPath();
    const path = `${uploadedFolderPath  }/current_files/${  employeeID  }/trainings_or_seminars/`;

    if (await helperMethods.isFolderExist(path)) {

      if (!await helperMethods.isFolderEmpty(path)) {
        const url = `${helperMethods.getURL()  }/${process.env.EC_EJS_VIEWS_FOLDER}/uploads/get-current-training-or-seminar-certificate?token=${  token}`;
        const attachedCertificate = `${url  }&trainingOrSeminarName=${  trainingOrSeminarName}`;
        records[i].attached_training_or_seminar_certificate = attachedCertificate;
      } 
      else throw `The folder: (trainings_or_seminars) is empty.`;

    }

  }

  return records;
}

async function isTrainingOrSeminarNameExist(employeeID, trainingOrSeminarName) {
  const query = `SELECT TOP 1 EmployeeCode
  FROM HR..EmployeeCompletedTrainingOrSeminar
  WHERE EmployeeCode = @EmployeeID 
  AND TrainingOrSeminarName = @TrainingOrSeminarName`;

  const parameters = [
    { name: "EmployeeID", dataType: "VarChar", value: employeeID },
    { name: "TrainingOrSeminarName", dataType: "VarChar", value: trainingOrSeminarName }
  ];

  const response = await helperMethods.executeQuery(query, parameters);

  return (response.recordset.length > 0) ? true : false;
}

async function createRequest(data) {
  let transaction;
  try {
    transaction = await helperMethods.beginTransaction();

    const createdBy = data.employee_id;
    const destinationTable = "EmployeeCompletedTrainingOrSeminar";

    let query = `INSERT INTO [UE database]..RequestHdr 
             (CreatedBy, DateTimeCreated, DestinationTable, RequestType)
             VALUES 
             (@CreatedBy, GETDATE(), @DestinationTable, @RequestType)`;

    const parameters = [
      { name: "CreatedBy", dataType: "VarChar", value: createdBy },
      { name: "DestinationTable", dataType: "VarChar", value: destinationTable },
      { name: "RequestType", dataType: "SmallInt", value: 1 }, // 1 = create
    ];

    let response = await helperMethods.executeQuery(query, parameters, transaction);
    if (response.rowsAffected[0] === 0) throw "No rows affected";

    query = `SELECT TOP 1 
             ID AS 'request_id' 
             FROM [UE database]..RequestHdr 
             ORDER BY DateTimeCreated DESC`;
    response = await helperMethods.executeQuery(query, null, transaction);
    const requestID = response.recordset[0].request_id;

    if (data.request_type === "create") await manipulateTableRequestDtl(transaction, requestID, data);
    else throw "Invalid value of request type";

    await helperMethods.commitTransaction(transaction);
    return requestID;
  } catch (error) {
    await helperMethods.rollbackTransaction(transaction);
    throw error;
  }
}

async function manipulateTableRequestDtl(transaction, id, data) {
  delete data.employee_id;
  delete data.request_type;

  for (const column in data) {
    const actualColumnName = toActualColumnName(column);
    let requestedNewValue = data[column];

    if (actualColumnName === "TRAINING OR SEMINAR CERTIFICATE") {
      requestedNewValue = `${data['training_or_seminar_name']  }.${  requestedNewValue.split('.').pop()}`;
    } else {
      requestedNewValue.toUpperCase().trim()
    }

    const query = `INSERT INTO [UE database]..RequestDtl 
          (RequestHdrID, ColumnName, NewValue)
          VALUES 
          (@RequestHdrID, @ColumnName, @NewValue)`;

    const parameters = [
      { name: "RequestHdrID", dataType: "Int", value: id },
      { name: "ColumnName", dataType: "VarChar", value: actualColumnName },
      { name: "NewValue", dataType: "VarChar", value: requestedNewValue }
    ];

    const response = await helperMethods.executeQuery(query, parameters, transaction);
    if (response.rowsAffected[0] === 0) throw "No rows affected";
  }
}

function toActualColumnName(column) {
  if (column === "training_or_seminar_name") return "TrainingOrSeminarName";
  else if (column === "training_provider") return "TrainingProvider";
  else if (column === "from_date") return "FromDate";
  else if (column === "to_date") return "ToDate";
  else if (column === "venue") return "Venue";
  else if (column === "attach_training_or_seminar_certificate") return "TRAINING OR SEMINAR CERTIFICATE";
}

module.exports = {
  get,
  createRequest,
  isTrainingOrSeminarNameExist
}