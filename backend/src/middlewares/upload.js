import multer from "multer";
import { storage } from "../config/cloudinary.js";

const upload = multer({ storage });

// Export a custom middleware for two fields
export const doctorFileUpload = upload.fields([
  { name: "certificate", maxCount: 1 },
  { name: "profilePic", maxCount: 1 },
]);
