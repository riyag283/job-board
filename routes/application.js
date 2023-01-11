const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application");
const userController = require("../controllers/user");

router.post(
  "/",
  userController.verifyUser,
  applicationController.createApplication
);
router.get("/", applicationController.getApplications);
router.get("/:id", applicationController.getApplication);
router.patch(
  "/:id",
  userController.verifyUser,
  applicationController.updateApplication
);
router.delete(
  "/:id",
  userController.verifyUser,
  applicationController.deleteApplication
);

module.exports = router;
