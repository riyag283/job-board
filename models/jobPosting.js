const mongoose = require("mongoose");
const { skills, experienceLevel } = require("../constants");

const jobPostingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiredSkills: skills,
    experienceLevel: {
      type: String,
      enum: experienceLevel,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const JobPosting = mongoose.model("JobPosting", jobPostingSchema);

module.exports = JobPosting;
