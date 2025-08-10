import express from 'express'
import { jwtVerify } from '../middlewares/auth.middleware.js';
import { commentOnStory, deleteComment, doctorLogin, doctorRegister, editComment, getAllDoctors, getDoctorById } from '../controllers/doctor.controller.js';
import { doctorFileUpload } from '../middlewares/upload.js';
import { getAppointmentsByDoctor, getAppointmentsByPatient } from '../controllers/appointment.controller.js';



const appointmentRouter = express.Router()

appointmentRouter.get('/by-doctor/:doctorId', jwtVerify, getAppointmentsByDoctor)
appointmentRouter.get('/patient', jwtVerify, getAppointmentsByPatient)




export default appointmentRouter;