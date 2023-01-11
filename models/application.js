const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobPosting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosting",
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /(^#+\s.+)/.test(v);
        },
        message: (props) => `Provide cover letter in a valid Markdown format!`,
      },
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

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
