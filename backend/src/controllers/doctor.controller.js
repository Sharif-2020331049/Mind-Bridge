import { Doctor } from "../models/doctor.model.js";
import validator from "validator";
import { ApiError } from "../utils/ApiError.js";
import { Story } from "../models/story.model.js";

// Utility to generate access and refresh token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const doctor = await Doctor.findById(userId);
    const accessToken = doctor.generateAccessToken();
    const refreshToken = doctor.generateRefreshToken();

    doctor.refreshToken = refreshToken;
    await doctor.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Problem occurred while creating Access token");
  }
};


const doctorRegister = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      specialization,
      bio,
      address,
      degree,
      medicalCollege,
      yearOfCompletion,
      workExperience,
      license,
      fees,
    } = req.body;

    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Check uploaded files
    const certificateFile = req.files?.certificate?.[0];
    const profilePicFile = req.files?.profilePic?.[0];

    if (!certificateFile || !profilePicFile) {
      return res.status(400).json({
        success: false,
        message: "Both certificate and profile picture are required",
      });
    }

    if (
      !fullName ||
      !email ||
      !password ||
      !phone ||
      !specialization ||
      !bio ||
      !address ||
      !degree ||
      !medicalCollege ||
      !yearOfCompletion ||
      !workExperience ||
      !license ||
      !fees
    ) {
      return res.status(401).json({
        success: false,
        message: "All field are required",
      });
    }

    const doctor = await Doctor.create({
      fullName,
      email,
      password,
      phone,
      specialization: specialization.split(","),
      bio,
      address,
      degree,
      medicalCollege,
      yearOfCompletion,
      workExperience,
      license,
      fees,
      certificate: certificateFile.path,
      profilePic: profilePicFile.path,
    });

    const createdDoctor = await Doctor.findById(doctor._id).select("-password");

    const { accessToken } = await generateAccessAndRefreshToken(doctor._id);

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      token: accessToken,
      doctor: createdDoctor,
    });
  } catch (error) {
    console.error("Register Doctor Error:", error);
    res.status(500).json({
      success: false,
      message: "Doctor registration failed",
    });
  }
};


const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await doctor.isPasswordCorrect(password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { accessToken } = await generateAccessAndRefreshToken(doctor._id);

    const loggedInDoctor = await Doctor.findById(doctor._id).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: loggedInDoctor,
      token: accessToken,
    });
  } catch (error) {
    console.log("Doctor login error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

const commentOnStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ success: false, message: "Comment text is required" });
    }

    // console.log(`In controller: ${req.user.role}`);

    // Check if logged-in user is a doctor
    if (req.role !== "doctor") {
      return res
        .status(403)
        .json({ success: false, message: "Only doctors can comment" });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res
        .status(404)
        .json({ success: false, message: "Story not found" });
    }

    story.comments.push({
      doctor: req.user._id,
      text,
    });

    await story.save();

    const commentedStory = await Story.findById(storyId).populate(
      "comments.doctor",
      "fullName profilePic"
    );

    res.status(200).json({
      success: true,
      commentedStory,
      message: "Comment added successfully",
      story,
    });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const editComment = async (req, res) => {
  try {
    const { storyId, commentId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ success: false, message: "Comment text is required" });
    }

    const story = await Story.findById(storyId);

    if (!story) {
      return res
        .status(404)
        .json({ success: false, message: "Story not found" });
    }

    const comment = story.comments.id(commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    // Ensure only the same doctor who created it can edit
    if (comment.doctor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to edit this comment" });
    }

    comment.text = text;
    await story.save();

    res.status(200).json({ success: true, message: "Comment updated", story });
  } catch (error) {
    console.error("Edit Comment Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { storyId, commentId } = req.params;

    const story = await Story.findById(storyId);

    if (!story) {
      return res
        .status(404)
        .json({ success: false, message: "Story not found" });
    }

    const comment = story.comments.id(commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (comment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this comment",
      });
    }

    comment.deleteOne(); // or comment.remove() if using older Mongoose
    await story.save();

    res.status(200).json({ success: true, message: "Comment deleted", story });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({})
      .select("-password -refreshToken") // Exclude sensitive fields
      .sort({ createdAt: -1 }); // Optional: sort newest first

    res.status(200).json({
      success: true,
      doctors,
      message: "Doctors fetched successfully",
    });
  } catch (error) {
    console.error("Get All Doctors Error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch doctors",
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId).select("-password -refreshToken");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
      message: "Doctor fetched successfully",
    });
  } catch (error) {
    console.error("Get Doctor by ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch doctor",
    });
  }
};


export {
  doctorRegister,
  doctorLogin,
  commentOnStory,
  editComment,
  deleteComment,
  getAllDoctors,
  getDoctorById
};
