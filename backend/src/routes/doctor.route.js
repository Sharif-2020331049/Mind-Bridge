import express from 'express'
import { jwtVerify } from '../middlewares/auth.middleware.js';
import { commentOnStory, deleteComment, doctorLogin, doctorRegister, editComment, getAllDoctors, getDoctorById } from '../controllers/doctor.controller.js';
import { doctorFileUpload } from '../middlewares/upload.js';


const doctorRouter = express.Router()

doctorRouter.post('/register', doctorFileUpload,  doctorRegister)
doctorRouter.post('/login', doctorLogin )
doctorRouter.get('/all-doctor', getAllDoctors)


doctorRouter.get('/get-doctor/:doctorId', getDoctorById)
// comment route
doctorRouter.post("/comment/:storyId", jwtVerify, commentOnStory);


doctorRouter.put("/edit-comment/:storyId/:commentId", jwtVerify, editComment);
doctorRouter.delete("/delete-comment/:storyId/:commentId", jwtVerify, deleteComment);

export default doctorRouter;
