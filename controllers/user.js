const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Signing secret
const SECRET = process.env.JWT_SECRET;

exports.createUser = async (req, res) => {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // Create the user with the hashed password
    const user = new User({
      ...req.body,
      password: hashedPassword,
    });
    await user.save();

    // Create a JWT and send it in the response
    const token = jwt.sign({ userId: user._id }, SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Create a JWT and send it in the response
    const token = jwt.sign({ userId: user._id }, SECRET, {
      expiresIn: "1d",
    });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    // Extract the token from the request headers
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    // Verify the token and extract the userId from it
    const { userId } = jwt.verify(token, SECRET);
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }
    // Check if the user exists and has the required role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    // Attach the user to the request object and call the next middleware
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
};
