const express = require("express");
const router = express.Router();
const jobPostingController = require("../controllers/jobPosting");
const userController = require("../controllers/user");

router.post(
  "/",
  userController.verifyUser,
  jobPostingController.createJobPosting
);
router.get("/", jobPostingController.getJobPostings);
router.get("/:id", jobPostingController.getJobPosting);
router.patch("/:id", jobPostingController.updateJobPosting);
router.delete("/:id", jobPostingController.deleteJobPosting);

module.exports = router;
