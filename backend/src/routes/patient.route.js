import express from 'express'
import { bookAppointment, getAllStories, getMyStories, loginPatient, registerPatient, updatePatientProfile, uploadStories } from '../controllers/patient.controller.js';
import { jwtVerify } from '../middlewares/auth.middleware.js';


const patientRouter = express.Router()

patientRouter.post('/register', registerPatient)
patientRouter.post('/login', loginPatient)
patientRouter.put('/update-profile', jwtVerify, updatePatientProfile);

// route for booking

patientRouter.post('/doctor-booking', jwtVerify, bookAppointment);

// End point for uplaod stories
patientRouter.post('/upload-story',jwtVerify, uploadStories)
patientRouter.get("/my-stories", jwtVerify, getMyStories);

// all stories
patientRouter.get("/all-stories", jwtVerify, getAllStories);




export default patientRouter;
