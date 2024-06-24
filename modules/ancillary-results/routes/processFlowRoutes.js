const { Router } = require("express");
const processFlowController = require("../controllers/processFlowController");
const { validateAccessToken } = require("../../../helpers/crypto");

const router = Router();

// GET REQUESTS
router.get("/", validateAccessToken, processFlowController.getProcessFlow);
router.get("/test-orders", processFlowController.getTestOrderProcessFlow);

// POST REQUESTS

// // PUT REQUESTS 
// router.put("/:code", validateAccessToken, chargeController.updatePatientCharge);

// IMPORTANT: ROUTE WITH ARBITRARY params SHOULD BE PLACED LAST TO AVOID CONFLICTS WITH OTHER ADJACENT ROUTES
// router.put("/:code", validateAccessToken, userController.updateUser);


// DELETE REQUESTS //

router.get("*", (req, res) => {
  res.status(400).send({ error: "API not found" });
});

module.exports = router;