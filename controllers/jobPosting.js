const JobPosting = require("../models/JobPosting");
const User = require("../models/User");

exports.createJobPosting = async (req, res) => {
  try {
    // Check if the user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the job posting
    const jobPosting = new JobPosting({
      ...req.body,
      createdBy: user._id,
    });
    await jobPosting.save();

    res.status(201).json({ jobPosting });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getJobPostings = async (req, res) => {
  try {
    const jobPostings = await JobPosting.find();
    res.json(jobPostings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getJobPosting = async (req, res) => {
  try {
    const jobPosting = await JobPosting.findById(req.params.id);
    console.log(jobPosting);
    console.log(req.params.id);
    if (jobPosting == null) {
      return res.status(404).json({ message: "Cannot find jobPosting" });
    }
    res.json(jobPosting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateJobPosting = async (req, res) => {
  try {
    const jobPosting = await JobPosting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (jobPosting == null) {
      return res.status(404).json({ message: "Cannot find jobPosting" });
    }
    res.json(jobPosting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteJobPosting = async (req, res) => {
  try {
    const jobPosting = await JobPosting.findByIdAndRemove(req.params.id);
    if (jobPosting == null) {
      return res.status(404).json({ message: "Cannot find jobPosting" });
    }
    res.json({ message: "Deleted JobPosting" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
