const JobPosting = require("../models/JobPosting");
const User = require("../models/User");

exports.createJobPosting = async (req, res) => {
  try {
    // Check if the user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(401).json({ message: "Not authorized" });
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
    // find user by id
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // find jobPosting by id and check if createdBy matches user id
    const jobPosting = await JobPosting.findOne({
      _id: req.params.id,
      createdBy: user._id,
    });
    if (!jobPosting) {
      return res.status(404).json({
        message:
          "You are not authorized to update this jobPosting or jobPosting not found",
      });
    }

    //update the jobPosting
    Object.assign(jobPosting, req.body);
    const updatedJobPosting = await jobPosting.save();
    res.json(updatedJobPosting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteJobPosting = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const jobPosting = await JobPosting.findById(req.params.id);
    if (jobPosting == null) {
      return res.status(404).json({ message: "Cannot find jobPosting" });
    }
    if (jobPosting.createdBy.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await jobPosting.remove();
    res.json({ message: "Deleted JobPosting" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
