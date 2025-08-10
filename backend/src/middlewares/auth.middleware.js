import jwt from "jsonwebtoken";
import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";

const jwtVerify = async (req, res, next) => {
  try {
    // const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    const token =  req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log(decoded)
    let user;
    if (decoded.role === "patient") {
      user = await Patient.findById(decoded._id).select("-password -refreshToken");
    } else if (decoded.role === "doctor") {
      user = await Doctor.findById(decoded._id).select("-password -refreshToken");
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token or user not found" });
    }

    req.user = user;
    req.role = decoded.role; // optional: expose role to controller


    // console.log(`In middleware: ${req.role}`);
    next();
  } catch (error) {
    console.log("JWT error:", error);
    res.status(401).json({ success: false, message: "Unauthorized: " + error.message });
  }
};

export { jwtVerify };
