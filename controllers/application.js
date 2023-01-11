const Application = require("../models/Application");
const JobPosting = require("../models/JobPosting");
const User = require("../models/User");

exports.createApplication = async (req, res) => {
  try {
    // Check if the job posting exists
    const jobPosting = await JobPosting.findById(req.body.jobPosting);
    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, create an account" });
    }

    // Create the application
    const application = new Application({
      ...req.body,
      createdBy: user._id,
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
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const application = await Application.findById(req.params.id);
    if (application == null) {
      return res.status(404).json({ message: "Cannot find application" });
    }
    if (application.createdBy.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const updatedApplication = await application.updateOne(req.body);
    res.json(updatedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const application = await Application.findById(req.params.id);
    if (application == null) {
      return res.status(404).json({ message: "Cannot find application" });
    }
    if (application.createdBy.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Not authorized hi" });
    }
    await application.remove();
    res.json({ message: "Deleted Application" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
