import { Patient } from "../models/patient.model.js";
import { Story } from "../models/story.model.js";
import validator from "validator";
import { ApiError } from "../utils/ApiError.js";
import { Appointment } from "../models/appointment.model.js";
import { Doctor } from "../models/doctor.model.js";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const patient = await Patient.findById(userId);
    const accessToken = patient.generateAccessToken();
    const refreshToken = patient.generateRefreshToken();

    patient.refreshToken = refreshToken;

    await patient.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Problem occurred while creating Access token");
  }
};

// Register Patient
const registerPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if patient exists
    const existing = await Patient.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Patient already exists" });
    }

    if (!validator.isEmail(email)) {
      // throw new ApiError(401, 'Please enter a valid email')
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 4) {
      // throw new ApiError(401, 'Please enter a strong password')
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const patient = await Patient.create({ name, email, password });

    const createdPatient = await Patient.findById(patient._id).select(
      "-password"
    );

    if (!createdPatient) {
      return res.json({
        success: false,
        message: "Something went wrong while regitering the Patient",
      });
    }

    const accessToken = await generateAccessAndRefreshToken(patient._id);
    // const refreshToken = patient.generateRefreshToken();

    res.status(201).json({
      message: "Patient registered successfully",
      success: true,
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// login patient
const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await patient.isPasswordCorrect(password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { accessToken } = await generateAccessAndRefreshToken(patient._id);

    const loggedInPatient = await Patient.findById(patient._id).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: loggedInPatient,
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

// logout patiendt (protected route)
const logoutPatient = async (req, res) => {
  try {
    const patientId = req.user?._id;

    if (!patientId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user found",
      });
    }

    // Remove refresh token from DB
    await Patient.findByIdAndUpdate(patientId, { refreshToken: null });

    // Optional: Clear token cookie if using cookies
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};



// protected route
const uploadStories = async (req, res) => {
  try {
    const { title, category, story } = req.body;

    if (!title || !category || !story) {
      return res.status(400).json({
        success: false,
        message: "All fields (title, category, story) are required",
      });
    }

    const newStory = await Story.create({
      title,
      category,
      story,
      uploadedBy: req.user._id, // populated by auth middleware
    });

    res.status(201).json({
      success: true,
      message: "Story uploaded successfully",
      story: newStory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to upload story",
    });
  }
};

// get My story
const getMyStories = async (req, res) => {
  try {
    const patientId = req.user._id; 

    const myStories = await Story.find({ uploadedBy: patientId }).sort({ createdAt: -1 });

    res.status(200).json(myStories);
  } catch (error) {
    console.error("Error fetching patient stories:", error);
    res.status(500).json({ message: "Failed to fetch your stories" });
  }
};

// protected route (Delete Story)
const deleteStories = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // Ensure only the uploader can delete
    if (story.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this story",
      });
    }

    await Story.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    console.error("Delete Story Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete story",
    });
  }
};


// protected route (update story)
const updateStories = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, story } = req.body;

    const existingStory = await Story.findById(id);

    if (!existingStory) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // Only uploader can update
    if (existingStory.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this story",
      });
    }

    existingStory.title = title || existingStory.title;
    existingStory.category = category || existingStory.category;
    existingStory.story = story || existingStory.story;

    const updatedStory = await existingStory.save();

    res.status(200).json({
      success: true,
      message: "Story updated successfully",
      story: updatedStory,
    });
  } catch (error) {
    console.error("Update Story Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update story",
    });
  }
};


// Update patient profile (name or password)
const updatePatientProfile = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { name, currentPassword, newPassword } = req.body;

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Update name if provided
    if (name) {
      patient.name = name;
    }

    // If password change is requested
    if (currentPassword && newPassword) {
      const isMatch = await patient.isPasswordCorrect(currentPassword);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      if (newPassword.length < 4) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 4 characters long",
        });
      }

      patient.password = newPassword;
    }

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate('uploadedBy', 'name email') // Still needed to join data
      .sort({ createdAt: -1 });

    // Replace real name/email with "Anonymous"
    const anonymousStories = stories.map(story => {
      return {
        ...story.toObject(),
        uploadedBy: {
          _id: story.uploadedBy._id, // keep the _id if needed
          name: "Anonymous",
          email: "hidden",
        },
      };
    });

    res.status(200).json({
      success: true,
      count: anonymousStories.length,
      stories: anonymousStories,
    });
  } catch (error) {
    console.error("Error fetching all stories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stories",
    });
  }
};


// book appointment controller
// Book Appointment (Protected Route)
const bookAppointment = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { doctorId, date, timeSlot } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID, date, and time slot are required",
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check for double booking
    const alreadyBooked = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
    });

    if (alreadyBooked) {
      return res.status(409).json({
        success: false,
        message: "This slot is already booked. Please choose another.",
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      doctorId,
      patientId,
      date,
      timeSlot,
      fee: doctor.fee || 1000, // fallback fee
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Book Appointment Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to book appointment",
    });
  }
};


export { 
  registerPatient, 
  loginPatient, 
  uploadStories, 
  deleteStories, 
  updateStories, 
  logoutPatient, 
  getMyStories,
  updatePatientProfile,
  getAllStories,
  bookAppointment

};
