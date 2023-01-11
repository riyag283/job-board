exports.getMyApplications = async (req, res) => {
  try {
    const jobPosting = await JobPosting.findById(req.params.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (jobPosting.createdBy.toString() !== user._id.toString()) {
      return res
        .status(404)
        .json({ message: "This job posting was not created by you" });
    }
    // Set default values for pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find all applications
    const applications = await Application.find({
      jobPosting: mongoose.Types.ObjectId(jobPosting._id),
    })
      .skip(skip)
      .limit(limit);

    // Map over the applications and retrieve the user details
    const applicationsWithUser = await Promise.all(
      applications.map(async (application) => {
        if (user) {
          return {
            ...application._doc,
            applicantName: user.name,
            applicantEmail: user.email,
          };
        }
      })
    );

    // Filter out any applications that were not found
    const filteredApplications = applicationsWithUser.filter(
      (application) => application !== undefined
    );

    // Get the count of all applications
    const count = await Application.countDocuments();
    // Calculate total pages
    const totalPages = Math.ceil(count / limit);
    res.json({
      applications: filteredApplications,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
