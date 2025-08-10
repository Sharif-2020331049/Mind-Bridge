import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "psycare", // change as needed
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

export { cloudinary, storage };
