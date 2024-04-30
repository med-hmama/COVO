const User = require("../models/userModel");
const ObjectID = require("mongoose").Types.ObjectId;
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const {
    phoneNumber,
    firstName,
    lastName,
    password,
    age,
    gender,
    profilePicture,
    role,
  } = req.body;

  const phoneNumberExists = await User.findOne({ phoneNumber });
  if (phoneNumberExists)
    return res
      .status(400)
      .json({ message: "This phone number already exists." });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    phoneNumber,
    firstName,
    lastName,
    password: hashedPassword,
    age,
    gender,
    profilePicture,
    role,
    review: {},
  });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      message: "User created successfully.",
      newUser,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
};

const getClientUsers = async (req, res) => {
  const clients = await User.find({ role: "client" });
  res.status(200).json(clients);
};

const getDriverUsers = async (req, res) => {
  const drivers = await User.find({ role: "driver" });
  res.status(200).json(drivers);
};

const getOneUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    const user = await User.findById(req.params.id).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown: " + req.params.id);
  }

  const {
    phoneNumber,
    firstName,
    lastName,
    password,
    age,
    gender,
    profilePicture,
    role,
    review,
  } = req.body;

  try {
    let updateFields = {
      phoneNumber,
      firstName,
      lastName,
      age,
      gender,
      profilePicture,
      role,
      review,
    };

    if (password) {
      const saltRounds = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      updateFields
    );

    if (updatedUser) {
      return res.json({ message: "Successfully updated" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await User.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Succefully deleted" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const getCurrentUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ user });
  } else {
    res.status(404).json("User not found.");
  }
};

const updateCurrentUserProfile = async (req, res) => {
  const { firstName, lastName, password, age, gender, profilePicture, role } =
    req.body;

  let updatedFields = {
    firstName,
    lastName,
    password,
    age,
    gender,
    profilePicture,
    role,
  };

  if (password) {
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    updatedFields.password = hashedPassword;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updatedFields
    );

    if (updatedUser) {
      await res.json({ updateUser });
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { phoneNumber, password } = req.body;

  const existingUser = await User.findOne({ phoneNumber });
  if (!existingUser)
    return res.status(400).json({ message: "Invalid credentials" });

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid)
    return res.status(400).json({ message: "Invalid credentials" });

  createToken(res, existingUser._id);

  return res.status(201).json({
    message: "Logged in successfully.",
    existingUser,
  });
};

const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const updateReview = async (req, res) => {
  const review = req.body;

  try {
    const updatedReview = await User.findByIdAndUpdate(
      { _id: req.params.id },
      review
    );

    if (updatedReview) {
      return res.json({ message: "Successfully updated" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getClientUsers,
  getDriverUsers,
  getOneUser,
  updateUser,
  deleteUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  loginUser,
  logoutUser,
  updateReview,
};
