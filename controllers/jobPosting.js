const JobPosting = require("../models/JobPosting");
const User = require("../models/User");
const { skills, experienceLevel } = require("../constants");

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
    // Set default values for pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Create the query object
    let query = JobPosting.find();

    // Filter by experience level
    if (req.query.experienceLevel) {
      if (!experienceLevel.includes(req.query.experienceLevel)) {
        res.status(400).json({
          message:
            "Invalid experience level, Please provide valid experience level",
        });
        return;
      }
      query = query.where("experienceLevel").equals(req.query.experienceLevel);
    }

    // Filter by required skills
    if (req.query.requiredSkills) {
      if (!skills.includes(req.query.requiredSkills)) {
        res
          .status(400)
          .json({ message: "Invalid skill, Please provide valid skill" });
        return;
      }
      query = query.where("requiredSkills").equals(req.query.requiredSkills);
    }

    // Execute the query
    const jobPostings = await query.skip(skip).limit(limit).exec();
    const count = await JobPosting.countDocuments(query.getQuery()).exec();

    res.json({
      jobPostings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
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
