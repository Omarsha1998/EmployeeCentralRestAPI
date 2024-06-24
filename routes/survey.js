const express = require("express");
const router = express.Router();

// const famDayMovieScreeningControllers = require("../modules/survey/controllers/fam-day-movie-screening.js");

// router.get(
//   "/family-day-movie-screening/employees",
//   famDayMovieScreeningControllers.getEmployees,
// );

// router.get(
//   "/family-day-movie-screening/remaining-seat-count",
//   famDayMovieScreeningControllers.getRemainingSeatCount,
// );

// router.post("/family-day-movie-screening", famDayMovieScreeningControllers.add);

router.get("*", (req, res) => {
  res.send({ error: "API Key not found" });
});

module.exports = router;
