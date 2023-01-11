const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const jobPostingRoutes = require("./routes/jobPosting");
const userRoutes = require("./routes/user");
const applicationRoutes = require("./routes/application");
const jobSearchRoutes = require("./routes/jobApplicants");

// Connect to MongoDB
mongoose.connect("mongodb://localhost/job-board", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Parse request bodies as JSON
app.use(bodyParser.json());

// Set up routes
app.use("/job-board/job-postings", jobPostingRoutes);
app.use("/job-board", userRoutes);
app.use("/job-board/applications", applicationRoutes);
app.use("/job-board/myApplicants", jobSearchRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
