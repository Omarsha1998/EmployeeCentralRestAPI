const { Router } = require("express");
// const itemsController = require("../../modules/purchase-request/controllers/itemController");
// const departmentsController = require("../../modules/purchase-request/controllers/departmentController");
// const purchaseRequestController = require("../../modules/purchase-request/controllers/purchaseRequestController");

const clearanceController = require("../controllers/clearanceController");
const departmentUserController = require("../controllers/departmentUserController");
const documentController = require("../controllers/documentController");
const gradeSheetController = require("../controllers/gradeSheetController");

const { validateAccessToken } = require("../../../helpers/crypto");

const router = Router();

///GET REQUESTS
// router.get("/get-clearance", validateAccessToken, clearanceController.getAllClearance)

//DOCUMENT SYSTEM ROUTE - GET REQUEST
// router.get("/getdocuments", validateAccessToken, documentController.getDocuments)
router.get("/pictures", validateAccessToken, documentController.viewImage);
router.get(
  "/old-students",
  validateAccessToken,
  documentController.getOldStudents,
);
router.get(
  "/student-documents",
  validateAccessToken,
  documentController.getStudentDocuments,
);
router.get(
  "/count-submitted-documents",
  validateAccessToken,
  documentController.countSubmittedDocuments,
);
router.get(
  "/count-required-documents",
  validateAccessToken,
  documentController.countRequiredDocuments,
);

//DOCUMENT SYSTEM ROUTE - POST REQUEST
router.post(
  "/upload-documents",
  validateAccessToken,
  documentController.uploadDocument,
);

//DOCUMENT SYSTEM ROUTE - PUT REQUEST
router.put(
  "/edit-documents",
  validateAccessToken,
  documentController.editDocument,
);

//DOCUMENT SYSTEM ROUTE - PUT REQUEST
router.put(
  "/delete-documents",
  validateAccessToken,
  documentController.deleteDocument,
);

//MANUAL GRADE ROUTE (TOR) - GET REQUEST
router.get(
  "/student-details",
  validateAccessToken,
  gradeSheetController.studentDetails,
);
router.get(
  "/all-students",
  validateAccessToken,
  gradeSheetController.studentList,
);
router.get("/grade-data", validateAccessToken, gradeSheetController.gradeData);
router.get("/notes-data", validateAccessToken, gradeSheetController.notesData);
router.get(
  "/uerm-degree-program",
  validateAccessToken,
  gradeSheetController.uermDegreeProgram,
);
router.get(
  "/credits-units",
  validateAccessToken,
  gradeSheetController.creditUnits,
);

router.get(
  "/suggested-subject",
  validateAccessToken,
  gradeSheetController.suggestedSubject,
);
router.get(
  "/suggested-subject-code",
  validateAccessToken,
  gradeSheetController.suggestSubjectCode,
);

router.get(
  "/get-subject-code",
  validateAccessToken,
  gradeSheetController.getSubjectCode,
);

router.get(
  "/suggest-entrance-credentials",
  validateAccessToken,
  gradeSheetController.suggestEntranceCredentials,
);
router.get(
  "/suggest-notes",
  validateAccessToken,
  gradeSheetController.suggestedNotes,
);
router.get(
  "/suggested-remarks",
  validateAccessToken,
  gradeSheetController.suggestedRemarks,
);

router.get("/rle-desc", validateAccessToken, gradeSheetController.getRleDesc);
router.get("/rle-total", validateAccessToken, gradeSheetController.getRleTotal);

router.get(
  "/clerk-desc",
  validateAccessToken,
  gradeSheetController.getClerkDesc,
);
router.get(
  "/clerk-total",
  validateAccessToken,
  gradeSheetController.getClerkTotal,
);

router.get(
  "/school-year",
  validateAccessToken,
  gradeSheetController.getSchoolYear,
);

router.get("/course", validateAccessToken, gradeSheetController.getCourseList);

//MANUAL GRADE ROUTE (TOR) - POST REQUEST
router.post(
  "/add-student",
  validateAccessToken,
  gradeSheetController.addStudent,
);
router.post("/add-grades", validateAccessToken, gradeSheetController.addGrade);
router.post("/add-notes", validateAccessToken, gradeSheetController.addNotes);
router.post(
  "/add-course",
  validateAccessToken,
  gradeSheetController.addCourses,
);

//MANUAL GRADE ROUTE (TOR) - PUT REQUEST
router.put(
  "/edit-grades-data",
  validateAccessToken,
  gradeSheetController.editGradesData,
);
router.put(
  "/edit-notes-remarks",
  validateAccessToken,
  gradeSheetController.editNotesRemarks,
);
router.put(
  "/edit-student-info",
  validateAccessToken,
  gradeSheetController.editStudentInfo,
);
router.put(
  "/finalized-student-info/:studentno",
  validateAccessToken,
  gradeSheetController.finalizedStudentData,
);
router.put(
  "/delete-subject",
  validateAccessToken,
  gradeSheetController.deleteSubject,
);

// CLEARANCE SYSTEM ROUTE - GET REQUESTS
router.get(
  "/get-clearance",
  validateAccessToken,
  clearanceController.getAllClearance,
);
router.get(
  "/application-request",
  validateAccessToken,
  clearanceController.getApplicationRequest,
);

router.get(
  "/requested-documents",
  validateAccessToken,
  clearanceController.requestedDocuments,
);

// CLEARANCE SYSTEM ROUTE - PUT REQUESTS
router.put(
  "/retract-clearance",
  validateAccessToken,
  clearanceController.retractClearance,
);
router.put(
  "/approved-reject-clearance",
  validateAccessToken,
  clearanceController.acceptOrRejectClearance,
);

///POST REQUESTS
router.post("/login", departmentUserController.loginDepartment);
router.post("/loginPortal", departmentUserController.loginDepartmentInPortal);

router.post(
  "/logout",
  validateAccessToken,
  departmentUserController.inauthenticate,
);

//DOCUMENT REQUEST
router.get(
  "/proof-of-payment",
  validateAccessToken,
  clearanceController.getProofOfPayment,
);

router.get("*", (req, res) => {
  res.status(400).send({ error: "API not found" });
});

module.exports = router;
