const { Router } = require("express");
const entityController = require("../controllers/entityController");
const { validateAccessToken } = require("../helpers/crypto");

const router = Router();

// GET REQUESTS
router.get("/",  entityController.index);
router.get("/nationalities",  entityController.getNationality);
router.get("/religions",  entityController.getReligion);
router.get("/civil-statuses",  entityController.getCivilStatus);


router.get("*", (req, res) => {
  res.status(400).send({ error: "API not found" });
});

module.exports = router;