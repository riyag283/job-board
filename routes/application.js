const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application");

router.post("/", applicationController.createApplication);
router.get("/", applicationController.getApplications);
router.get("/:id", applicationController.getApplication);
router.patch("/:id", applicationController.updateApplication);
router.delete("/:id", applicationController.deleteApplication);

module.exports = router;
