const sqlHelper = require("../../../helpers/sql");
const util = require("../../../helpers/util");

const searchClearance = async function (conditions, txn) {
  return await sqlHelper.query(
    `SELECT 
      clearanceCode
    FROM Clearance..ClearanceDetails
    WHERE ${conditions}`,
    [],
    txn,
  );
};

const acceptClearance = async function (payload, conditons, txn) {
  return await sqlHelper.update(
    "Clearance..ClearanceDetails",
    payload,
    conditons,
    txn,
  );
};

const selectForApproval = async function (conditions, txn) {
  return await sqlHelper.query(
    `SELECT
      s.firstName,
      s.lastName,
      s.middleName,
      c.code,
      c.studentNo,
      c.collegeLevel,
      c.type,
      c.lastSchoolAttended,
      c.degreeProgramObtained,
      c.dateOfGraduation,
      c.email,
      c.mobileNo,
      c.landlineNo,
      c.country,
      c.roomNo,
      c.lotNo,
      c.street,
      c.barangay,
      c.region,
      c.province,
      c.city,
      c.zipCode,
      c.fullAddress,
      c.status clearanceStatus
    FROM [Clearance]..[Clearance] c
    LEFT JOIN [UE database]..Student s on s.SN = c.StudentNo
    WHERE ${conditions}`,
    [],
    txn,
  );
};

const selectProofOfPayment = async function (conditions, txn) {
  return await sqlHelper.query(
    `SELECT
      s.firstname,
      s.lastname,
      pp.sn, 
      pp.paymentMethod,
      pp.referenceNo,
      pp.transactionDate,
      pp.amount,
      pp.uploadedFile,
      pp.files,
      pp.orNo
    FROM [OnlinePayments]..ProofPayment pp
    LEFT JOIN [UE database]..Student s ON s.sn = pp.sn
    WHERE ${conditions}`,
    [],
    txn,
  );
};

const selectRequestedDocuments = async function (conditions, txn) {
  return await sqlHelper.query(
    `SELECT 
      rd.studentNo,
      rd.documentName,
      rd.originalPrice,
      rd.priceBasedOnQuantity,
      rd.quantity
    FROM Clearance..RequestDocuments rd
    WHERE ${conditions}`,
    [],
    txn,
  );
};

module.exports = {
  searchClearance,
  acceptClearance,
  selectForApproval,
  selectProofOfPayment,
  selectRequestedDocuments,
};
