const Application = require("../models/Application");
const JobPosting = require("../models/JobPosting");

exports.createApplication = async (req, res) => {
  try {
    // Check if the job posting exists
    const jobPosting = await JobPosting.findById(req.body.jobPosting);
    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    // Create the application
    const application = new Application({
      ...req.body,
    });
    await application.save();

    res.status(201).json({ application });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (application == null) {
      return res.status(404).json({ message: "Cannot find application" });
    }
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (application == null) {
      return res.status(404).json({ message: "Cannot find application" });
    }
    res.json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndRemove(req.params.id);
    if (application == null) {
      return res.status(404).json({ message: "Cannot find application" });
    }
    res.json({ message: "Deleted Application" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
