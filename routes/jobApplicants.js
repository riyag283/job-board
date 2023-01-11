const express = require("express");
const router = express.Router();
const jobApplicantsController = require("../controllers/jobApplicants");
const userController = require("../controllers/user");

router.get(
  "/:id",
  userController.verifyUser,
  applicationController.getMyApplications
);

module.exports = router;
