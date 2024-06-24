const util = require("../../helpers/util");
const sqlHelper = require("../../helpers/sql");

const selectStudentApplications = async function (
  conditions,
  args,
  options,
  txn,
) {
  try {
    const applications = await sqlHelper.query(
      `SELECT
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      id,
      ref_number refNumber,
      app_number appNumber,
      sn,
      concat(last_name,', ',first_name,' ',middle_name) fullName,
      gender,
      birthdate,
      mobile_number mobileNumber,
      email,
      isFilipino,
      app_type appType,
      college,
      college_desc collegeName,
      course,
      course_desc courseName,
      year_from yearFrom,
      year_to yearTo,
      case when course = 'MD'
        then case when nmat = 0.00
                then [NMAT DATE]
              else concat(nmat, ' - ', [NMAT DATE])
            end
        else 'N/A'
      end nmat,
      sem semester,
      sem_desc semesterName,
      forAcceptance,
      accepted,
      received,
      rejected,
      [for interview] forInterview,
      ISNULL(APPLICATION_STATUS,'PENDING') appStatus,
      forInterviewDate,
      forAcceptanceDate,
      acceptDate,
      acceptedType,
      acceptedListBatch,
      acceptedDocumentDate,
      choice,
      appStatus appInfoStatus,
      personalInfoStatus,
      educationInfoStatus,
      financialInfoStatus,
      hasPhoto,
      detailsCompleted,
      applicantCompleted,
      hasForValidationDocs,
      hasValidatedDocs,
      hasGWA,
      applicationFee,
      undergradAcceptedWithDocs,
      lastUploadedDocuments,
      code,
      acceptBy,
      dateCreated,
      undergradUndertakingStatus,
      currentChoice,
      orNumbers,
      isEnrolled,
      isInterviewScheduled,
      interviewSchedule,
      interviewerId,
      isOfficiallyEnrolled,
      isWaitListed,
      isWithdrawn
    from UERMOnlineAdmission..vw_Applications
    WHERE 1=1 ${conditions}
    ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
      args,
      txn,
    );

    applications.forEach(async (list) => {
      list.dateCreated = await util.formatDate2({
        date: list.dateCreated,
      });

      list.lastUploadedDocuments = await util.formatDate2({
        date: list.lastUploadedDocuments,
      });

      if (list.acceptDate !== null) {
        list.formattedDTAccepted = await util.formatDate2({
          date: list.acceptDate,
        });
      }
    });

    return applications;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const selectApplicantPayment = async function (conditions, args, options, txn) {
  try {
    const applications = await sqlHelper.query(
      `SELECT
        STRING_AGG(concat(pd.description,': ',ORNO), ', ') as ORNumbers
      from UERMOnlineAdmission..vw_Applications v
          left join UERMMMC..PAYMENTS_MAIN pm on v.SN=pm.StudentNo 
          left join UERMMMC..PAYMENTS_DETAILS pd on pm.TRANSNO=pd.TRANSNO
      where  APPLICATION_STATUS='ACCEPTED'
        and sn not in ('N/A') 
        and ACCOUNTCODE in ('742200','122000')
        ${conditions}
    ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
      args,
      txn,
    );
    return applications;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const selectStudentWithDocs = async function (conditions, args, options, txn) {
  try {
    const applications = await sqlHelper.query(
      `SELECT DISTINCT
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      ref_number refNumber,
      sn,
      concat(last_name,', ',first_name,' ',middle_name) fullName,
      gender,
      mobile_number mobileNumber,
      email,
      isFilipino,
      course,
      course_desc courseDesc,
      hasForValidationDocs,
      hasValidatedDocs,
      detailsCompleted,
      lastUploadedDocuments
    from UERMOnlineAdmission..vw_Applications
    WHERE 1=1 ${conditions}
    ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
      args,
      txn,
    );
    return applications;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const selectStudentWithProofOfPayment = async function (
  conditions,
  args,
  options,
  txn,
) {
  try {
    const applications = await sqlHelper.query(
      `SELECT DISTINCT
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      a.ref_number refNumber,
      a.app_number appNumber,
      sn,
      concat(last_name,', ',first_name,' ',middle_name) fullName,
      a.sem,
      a.course,
      a.COURSE_DESC courseName,
      gender,
      mobile_number mobileNumber,
      email,
      isFilipino,
      hasForValidationDocs,
      hasValidatedDocs,
      detailsCompleted,
      lastUploadedDocuments,
      acceptedType,
      acceptedListBatch,
      acceptedDocumentDate,
      orNumbers,
      b.status,
      b.dateTimeUpdated
    from UERMOnlineAdmission..vw_Applications a
    join UERMOnlineAdmission..PersonalInfoDocuments b on b.Ref_Number = a.REF_NUMBER and b.active = 1
    WHERE 1=1 ${conditions}
    ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
      args,
      txn,
    );

    return applications;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const selectStudentRequirements = async function (
  conditions,
  args,
  options,
  txn,
) {
  try {
    const applications = await sqlHelper.query(
      `SELECT
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      Id
      ,ApplicationNumber
      ,ReferenceNumber
      ,RequirementCode
      ,Active
      ,DateTimeCreated
      ,DateTimeUpdated
    from UERMOnlineAdmission..ApplicantRequirements
    WHERE 1=1 ${conditions}
    ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
      args,
      txn,
    );
    return applications;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const selectStudentNotes = async function (conditions, args, options, txn) {
  try {
    const applications = await sqlHelper.query(
      `SELECT
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      refNo,
      appNo,
      remarks,
      createDate,
      createBy,
      cancelled,
      cancelDate,
      cancelBy
    from UERMOnlineAdmission..ApplicantRemarks
    WHERE 1=1 ${conditions}
    ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
      args,
      txn,
    );
    return applications;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const selectStudentNoteTemplates = async function (
  conditions,
  args,
  options,
  txn,
) {
  try {
    const applications = await sqlHelper.query(
      `SELECT
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      code,
      name,
      description,
      type,
      active,
      dateTimeCreated,
      dateTimeUpdated,
      remarks
    from UERMOnlineAdmission..ApplicantRemarksTemplates
    WHERE 1=1 ${conditions}
    ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
      args,
      txn,
    );
    return applications;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const selectScholasticRecords = async function (
  conditions,
  args,
  options,
  txn,
) {
  try {
    const applications = await sqlHelper.query(
      `SELECT
      ${util.empty(options.top) ? "" : `TOP(${options.top})`}
      a.code,
      a.ref_number,
      a.app_number,
      term,
      description,
      generalWeightedAverage,
      subjectCode,
      grade,
      a.active,
      a.dateTimeCreated,
      a.dateTimeUpdated
    FROM UERMOnlineAdmission..[ApplicantScholasticRecords] a 
    join UERMOnlineAdmission..ApplicantScholasticRecordDetails b on a.code = b.scholasticRecordCode
    WHERE 1=1 ${conditions}
    ${util.empty(options.order) ? "" : `order by ${options.order}`}
    `,
      args,
      txn,
    );
    return applications;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const insertStudentRequirements = async function (payload, txn) {
  if (!util.isObj(payload)) {
    return { error: true, message: "Invalid Applicant Requirements" };
  }
  try {
    return await sqlHelper.insert(
      `UERMOnlineAdmission..ApplicantRequirements`,
      payload,
      txn,
    );
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const updateStudentRequirements = async function (payload, condition, txn) {
  if (!util.isObj(payload)) {
    return { error: true, message: "Invalid Applicant Requirements" };
  }
  try {
    return await sqlHelper.update(
      `UERMOnlineAdmission..ApplicantRequirements`,
      payload,
      condition,
      txn,
    );
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const updateStudentDocument = async function (payload, condition, txn) {
  if (!util.isObj(payload)) {
    return { error: true, message: "Invalid Applicant Document" };
  }
  try {
    return await sqlHelper.updateV2(
      `UERMOnlineAdmission..PersonalInfoDocuments`,
      payload,
      condition,
      txn,
      "dateTimeUpdated",
      true,
      0,
    );
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const updateScholaticRecords = async function (payload, condition, txn) {
  if (!util.isObj(payload)) {
    return { error: true, message: "Invalid Scholastic Records" };
  }
  try {
    return await sqlHelper.update(
      `UERMOnlineAdmission..ApplicantScholasticRecords`,
      payload,
      condition,
      txn,
    );
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const updateScholaticRecordDetails = async function (payload, condition, txn) {
  if (!util.isObj(payload)) {
    return { error: true, message: "Invalid Scholastic Records" };
  }
  try {
    return await sqlHelper.update(
      `UERMOnlineAdmission..ApplicantScholasticRecordDetails`,
      payload,
      condition,
      txn,
    );
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const insertStudentNotes = async function (payload, txn) {
  if (!util.isObj(payload)) {
    return { error: true, message: "Invalid Applicant Remarks" };
  }
  try {
    return await sqlHelper.insert(
      `UERMOnlineAdmission..ApplicantRemarks`,
      payload,
      txn,
      "createDate",
    );
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const insertScholasticRecords = async function (payload, txn) {
  if (!util.isObj(payload)) {
    return { error: true, message: "Invalid Scholastic Records" };
  }
  try {
    return await sqlHelper.insert(
      `UERMOnlineAdmission..ApplicantScholasticRecords`,
      payload,
      txn,
    );
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const insertScholasticRecordDetails = async function (payload, txn) {
  if (!util.isObj(payload)) {
    return { error: true, message: "Invalid Scholastic Records Details" };
  }
  try {
    return await sqlHelper.insert(
      `UERMOnlineAdmission..ApplicantScholasticRecordDetails`,
      payload,
      txn,
    );
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

const updateStudentApplicationStatus = async function (
  payload,
  condition,
  txn,
) {
  if (!util.isObj(payload)) {
    return { error: true, message: "Invalid Applicant Status" };
  }

  try {
    const returnVal = await sqlHelper.update(
      `UERMOnlineAdmission..ApplicationInfo`,
      payload,
      condition,
      txn,
    );
    return returnVal;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

module.exports = {
  selectStudentApplications,
  selectApplicantPayment,
  selectStudentRequirements,
  selectStudentNoteTemplates,
  selectStudentNotes,
  selectStudentWithDocs,
  selectScholasticRecords,
  selectStudentWithProofOfPayment,
  insertStudentRequirements,
  insertStudentNotes,
  insertScholasticRecords,
  insertScholasticRecordDetails,
  updateStudentRequirements,
  updateStudentDocument,
  updateStudentApplicationStatus,
  updateScholaticRecords,
  updateScholaticRecordDetails,
};
