const { Router } = require("express");

const multer = require("multer");
const fs = require("fs");
const excelToJson = require("convert-excel-to-json");

const mainController = require("../controllers/mainController");
const assetsController = require("../controllers/assetsController");
const assetsComponentsController = require("../controllers/assetsComponentsController");
const accessRightsController = require("../controllers/accessRightsController");
const buildingController = require("../controllers/buildingController");
const allotmentHistoryController = require("../controllers/allotmentHistoryController");
const departmentsController = require("../controllers/departmentsController");
const categoriesController = require("../controllers/categoriesController");
const originController = require("../controllers/originController");
const countedByController = require("../controllers/countedByController");
const dispositionController = require("../controllers/dispositionController");
const suppliersController = require("../controllers/suppliersController"); 
const searchCodeController = require("../controllers/searchCodeController");
const { validateAccessToken } = require("../../../helpers/crypto");

const router = Router();

router.get("/supplier-lists", validateAccessToken,suppliersController.getSuppliers);


// GET REQUESTS
router.get("/assets", validateAccessToken, assetsController.getAssets);
router.get(
  "/assets-all-active",
  validateAccessToken,
  assetsController.getAssetsActive,
);
router.get(
  "/parts-all-active",
  validateAccessToken,
  assetsController.getPartsActive,
);
router.get(
  "/active-whole-equipment",
  validateAccessToken,
  assetsController.getActiveEquipmentWhole,
);


router.get("/building", validateAccessToken, buildingController.getBuildings);

router.get(
  "/assets-per-department",
  validateAccessToken,
  assetsController.getAssetsByDepartment,
);
router.get(
  "/assets-bypass-condem",
  validateAccessToken,
  assetsController.getAssetsByPassCondem,
);

router.get(
  "/assets-approval-transfer",
  validateAccessToken,
  assetsController.getAssetsApprovalTransfers,
);
router.get(
  "/distinct-asset",
  validateAccessToken,
  assetsController.getDistinctApprovalTransferFormNo,
); //property distinct for ara form whole
router.get(
  "/ce-distinct-asset",
  validateAccessToken,
  assetsController.getCEDistinctApprovalTransferFormNo,
); //by IT distinct for ara form whole

router.get(
  "/parts-approval-transfer",
  validateAccessToken,
  assetsController.getPartsApprovalTransfers,
); // transfer request parts table by property (specifc )
router.get(
  "/search-code",
  validateAccessToken,
  assetsController.getSearcAssetCode,
);
router.get(
  "/search-code-IT",
  validateAccessToken,
  assetsController.getSearcITAssetCode,
);

router.get("/ce-approval-transfer", validateAccessToken, assetsController.getCEApprovalTransfers);
router.get("/ce-assets",validateAccessToken, assetsController.getAssetsCE);
router.get("/ce-parts",  validateAccessToken,assetsComponentsController.getAllCEParts);

router.get("/searchCode", validateAccessToken, assetsController.getSearchCode); //test
router.get(
  "/ce-no-assetcode",
  validateAccessToken,
  assetsController.getAssetsCEnoAssetCode,
);

router.get("/ce-approval-transfer-parts",validateAccessToken, assetsController.getCEApprovalTransfersParts);


router.get("/access",validateAccessToken, accessRightsController.getAccessRights);
router.get("/pending-transfer", validateAccessToken,  assetsController.getAssetsPendingTransfers);
router.get("/pending-condemn", validateAccessToken,  assetsController.getAssetsCondemnTransfer);
router.get("/pending-condemn-parts", validateAccessToken,  assetsController.getPartsCondemnTransfer);
router.get("/approval-condemn", validateAccessToken,  assetsController.getAssetsCondemnApproval);
router.get("/approval-condemn-parts", validateAccessToken, assetsController.getPartsCondemnForApproval);
router.get("/ce-retired-whole", validateAccessToken,assetsController.getRetiredCEWholeAsset);
router.get("/all-retired-whole",  validateAccessToken,assetsController.getAllRetiredWholeAsset);

router.get("/ce-retired-parts",  validateAccessToken,assetsController.getRetiredCEParts);
router.get("/allotment-history", validateAccessToken,allotmentHistoryController.getAllotmentHistory);//used
router.get("/condem-parts-history",validateAccessToken, allotmentHistoryController.getCondemHistoryParts);

router.get("/allotment-history-by-parts",  validateAccessToken,allotmentHistoryController.getAllotmentHistoryByParts); //used
router.get("/logs-approved-parts",  validateAccessToken,allotmentHistoryController.getApprovedTransferBYPartsLog); //used
router.get("/max",validateAccessToken,allotmentHistoryController.getMaxId);

router.get("/allotment-history-by-parts-approved",  validateAccessToken,assetsComponentsController.getPartsLogApproved);
router.get("/approved-transfer-asset",  validateAccessToken,assetsController.getApprovedAssetLogs);
router.get("/approved-transfer-parts",  validateAccessToken,allotmentHistoryController.getApprovedTransferPartsLog);
router.get("/approved-only-parts",  validateAccessToken,assetsComponentsController.getPartsApprovedPartOnly);




router.get(
  "/assets-testing",
  validateAccessToken,
  assetsController.getAssetsTesting,
);
router.get("/old/assets", validateAccessToken, assetsController.getOldAssets);
router.get("/assigned-components",validateAccessToken, assetsComponentsController.getCurrentAssignedComponents); 
router.get("/assigned-components-parts",validateAccessToken, assetsComponentsController.getComponentParts);
router.get("/condemned-components",validateAccessToken, assetsComponentsController.getPartsApprovedPartsWithMainAsset);//used
router.get("/assetDepts", validateAccessToken, assetsController.getAllRetiredWholeAssetDepartment); 
router.get("/condemned-components-parts",validateAccessToken, assetsComponentsController.getCondemLogInfo);

// router.get("/condem-parts-remarks",validateAccessToken, assetsComponentsController.getCondemLogParts);
// router.get("/condem-assets-remarks",validateAccessToken, assetsComponentsController.getCondemLogAssets);

router.get("/transferred-components",validateAccessToken, assetsComponentsController.getPartsApprovedPartsWithMainAssetTRANSFER);//used


router.get("/parts-waiting-room",validateAccessToken,assetsComponentsController.getPartsInactive); //used
router.get("/active-selected-parts",validateAccessToken,assetsComponentsController.getPartsActiveInactive); //used
router.get("/active-parts-to-condem",validateAccessToken,assetsComponentsController.getPartsActiveOnly);//used
router.get("/parts-by-asset-code",validateAccessToken,assetsComponentsController.getPartsByAssetCode);//used

router.get("/pending-condem-selected-parts",validateAccessToken,assetsComponentsController.getPendingCondemParts);//used


router.get("/parts-with-whole",validateAccessToken,assetsComponentsController.getIncludedPartsWithWhole); //used

router.get("/parts-review",validateAccessToken,assetsComponentsController.getIncludedPartsInformationReview); //used

router.get(
  "/parts-viewing-property",
  validateAccessToken,
  assetsComponentsController.getPartsActiveInactiveNoDeptLimit,
); //used

router.get(
  "/parts-included-print",
  validateAccessToken,
  assetsComponentsController.getPartsTransferPrint,
);

router.get(
  "/no-distinct",
  validateAccessToken,
  assetsController.getDistinctTransferFormNo,
); //used
router.get(
  "/no-distinct-parts",
  validateAccessToken,
  assetsController.getDistinctTransferFormNoParts,
); //used
router.get(
  "/no-distinct-parts-IT",
  validateAccessToken,
  assetsController.getDistinctTransferFormNoPartsIT,
); //by it
router.get(
  "/no-distinct-parts-property",
  validateAccessToken,
  assetsController.getDistinctTransferFormNoPartsProperty,
); //by property
router.get(
  "/no-distinct-parts-ara",
  validateAccessToken,
  assetsController.getDistinctAraFormByDeptParts,
); 
router.get(
  "/upcoming-condem-parts",
  validateAccessToken,
  assetsController.getUpcomingPartsCondemRequest,
);
router.get("/pending-condemn-assets",validateAccessToken,  assetsController.getDistinctAraFormNo);//used
router.get("/pending-condemn-assets-property",validateAccessToken,  assetsController.getDistinctAraFormNoByProperty); //used
router.get("/upcoming-request-to-condem",validateAccessToken,  assetsController.getUpcomingCondemRequest); //used


router.get(
  "/ara-form-asset",
  validateAccessToken,
  assetsController.getAssetToCondemn,
);

router.get(
  "/asset-to-transfer",
  validateAccessToken,
  assetsController.getAssetToTransfer,
); //by dept
router.get(
  "/asset-to-transfer-property",
  validateAccessToken,
  assetsController.getAssetToTransferProperty,
); //property USED
router.get(
  "/asset-to-transfer-IT",
  validateAccessToken,
  assetsController.getAssetToTransferIT,
); //by IT USED

router.get(
  "/parts-to-transfer",
  validateAccessToken,
  assetsController.getPartsToTransfer,
); //by dept used
router.get(
  "/parts-to-transfer-IT-Equip",
  validateAccessToken,
  assetsController.getPartsToTransferITEquip,
); //used

router.get(
  "/parts-to-transfer-property",
  validateAccessToken,
  assetsController.getPartsToTransferProperty,
); //by property used
router.get(
  "/asset-to-condemn-approval-property",
  validateAccessToken,
  assetsController.getCondemnListProperty,
);
router.get(
  "/parts-to-condemn",
  validateAccessToken,
  assetsController.getPartsToTCondemnByDept,
);
// router.get(
//   "/last-ara", validateAccessToken,
//   assetsController.getLastAraNo,
// );
router.get(
  "/last-transfer-form-no", validateAccessToken,
  assetsController.getLastTransferFormNo,
);


router.get(
  "/all-parts",
  validateAccessToken,
  assetsComponentsController.getAllParts,
);
router.get(
  "/all-parts-bypass-condem",
  validateAccessToken,
  assetsComponentsController.getAllPartsByPassCondem,
);

router.get(
  "/included-parts",
  validateAccessToken,
  assetsComponentsController.getIncludedPartsToTransfer,
);
router.get(
  "/homepage-parts",
  validateAccessToken,
  assetsComponentsController.getParts,
);
router.get(
  "/all-parts-inactive",
  validateAccessToken,
  assetsComponentsController.getAllPartsInactive,
);

// router.get(
//   "/unassigned-components",
//   validateAccessToken,
//   assetsComponentsController.getInactiveComponents,
// );
router.get(
  "/departments",
  departmentsController.getDepartments,
);
router.get(
  "/categories",
  validateAccessToken,
  categoriesController.getCategories,
);

// router.get(
//   "/item-categories",
//   categoriesController.getItemCategories,
// );
router.get(
  "/non-categories",
  validateAccessToken,
  categoriesController.getNonITCategories,
);

router.get("/origin", validateAccessToken, originController.getOrigin);
router.get("/audit", validateAccessToken, countedByController.getAudit);
router.get(
  "/requestby",
  validateAccessToken,
  countedByController.getRequestedBy,
);
router.get("/dispositions", validateAccessToken,dispositionController.getDisposition); 
router.get("/code", validateAccessToken, searchCodeController.getCode); 
router.get(
  "/retired-parts",
  validateAccessToken,
  assetsComponentsController.getRetiredPartsAll,
);

// POST REQUESTS
router.post("/assets", validateAccessToken, assetsController.postAssets); //reAssignment module separating assets and components
router.post(
  "/register-asset",
  validateAccessToken,
  assetsController.postRegisterAsset,
); //Whole Asset registration by property
router.post(
  "/register-asset-ce",
  validateAccessToken,
  assetsController.postRegisterAssetCE,
); // CE registration
router.get(
  "/rr-counts",
  validateAccessToken,
  assetsController.getRRNumber,
);

router.post(
  "/register-component",
  validateAccessToken,
  assetsComponentsController.postRegisterComponent,
);

router.post(
  "/transfer-assets",
  validateAccessToken,
  assetsController.postAssetsTransfer,
); //whole transfering (general access) USED
router.post(
  "/request-transfer-parts",
  validateAccessToken,
  assetsController.postPartsTransfer,
); //by parts transferring (general access)
router.post(
  "/postAssetsCondemn",
  validateAccessToken,
  assetsController.postAssetsCondemn,
);
router.post(
  "/condem-direct-approval-asset",
  validateAccessToken,
  assetsController.condemDirectApproval,
);

router.post(
  "/condemn-request-parts",
  validateAccessToken,
  assetsController.postSendCondemnRequestParts,
);
router.post(
  "/condemn-direct-approved-parts",
  validateAccessToken,
  assetsController.partsCondemDirectApproval,
);

router.post(
  "/postAssetsCondemnApproved",
  validateAccessToken,
  assetsController.postAssetsCondemnApproved,
);

router.post(
  "/condemn-approving-parts",
  validateAccessToken,
  assetsController.postPartsCondemnApproved, 
); //used

//for testing
router.post("/upload-excel", assetsController.postjsonData);

// const upload = multer({ dest: "uploads/",
// limits: {
//   fileSize: 1024 * 1024 * 5, // 5 MB limit (adjust as needed)
// },
// });
// const upload = multer({ dest: 'uploads/' });
// router.post("/uploadMe", upload.single("file"), assetsController.convertME);

// PUT REQUESTS
router.put("/update-assets", validateAccessToken, assetsController.putAssets);
router.put(
  "/update-parts",
  validateAccessToken,
  assetsComponentsController.putPartsInfo,
);
router.put(
  "/update-parts-accounting",
  validateAccessToken,
  assetsComponentsController.putPartsInfoAccounting,
);

router.put(
  "/cancel-transfer-parts",
  validateAccessToken,
  assetsComponentsController.putPartsCancelTransfer,
); //used
router.put(
  "/cancel-transfer",
  validateAccessToken,
  assetsController.putAssetsCancelTransfer,
); //USED
router.put(
  "/cancel-condemn",
  validateAccessToken,
  assetsController.putAssetsCancelCondemn,
);
router.put(
  "/cancel-condemn-parts",
  validateAccessToken,
  assetsController.putPartsCancelCondemn,
);
router.put(
  "/ce-asset-coding",
  validateAccessToken,
  assetsController.putAssignAssetCodeCE,
);

router.put(
  "/update-assets-transfer-approval",
  validateAccessToken,
  assetsController.putAssetsTransfer,
); //USED

router.put("/update-parts-transfer-approval",validateAccessToken, assetsController.putAssetsTransferParts);//used

router.put(
  "/update-assets-transfer-location",
  validateAccessToken,
  assetsController.putAssetsTransferLocation,
);
router.put(
  "/update-components",
  validateAccessToken,
  assetsComponentsController.putUnassignedComponent,
);
router.put(
  "/reassign-component",
  validateAccessToken,
  assetsComponentsController.putReassignComponent,
);

//  router.get("/users/:code", validateAccessToken, .updateUser);

// router.put("/users/:code", validateAccessToken, userController.updateUser);

// router.put("/update", userController.updateUser);

// router.put("/reset-pw", validatePwResetToken, userController.resetPassword);

// IMPORTANT: ROUTE WITH ARBITRARY params SHOULD BE PLACED LAST TO AVOID CONFLICTS WITH OTHER ADJACENT ROUTES
// router.put("/:code", validateAccessToken, userController.updateUser);

// DELETE REQUESTS //

// GET REQUESTS

router.get("*", (req, res) => {
  res.status(400).send({ error: "API endpoint not found" });
});

module.exports = router;
