import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const doctorSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    certificate: {
      type: String, // URL to certificate image/file
      required: true,
    },
    specialization: {
      type: [String], // Array of specializations
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    medicalCollege: {
      type: String,
      required: true,
    },
    yearOfCompletion: {
      type: String,
      required: true,
    },
    workExperience: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String, // URL to profile image
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "deactivate"],
      default: "deactivate",
    },
    license: {
        type: String,
        required: true
    }, 
    fees: {
       type: Number,
       required: true
    },
    role: {
      type: String,
      default: "doctor"
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance methods
doctorSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

doctorSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: "doctor",
      name: this.fullName,
      email: this.email,
      status: this.status,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

doctorSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

doctorSchema.methods.changeStatus = function (newStatus) {
  if (["active", "deactivate"].includes(newStatus)) {
    this.status = newStatus;
    return this.save();
  }
  throw new Error("Invalid status value");
};

export const Doctor = mongoose.model("Doctor", doctorSchema);
