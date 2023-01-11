const mongoose = require("mongoose");

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
    requiredSkills: [
      {
        type: String,
        enum: ["JavaScript", "Node.js", "React", "MongoDB", "GraphQL"],
        required: true,
      },
    ],
    experienceLevel: {
      type: String,
      enum: ["internship", "entry-level", "mid-level", "senior-level"],
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
