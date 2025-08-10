import mongoose from "mongoose";
import { Appointment } from "../models/appointment.model.js";

const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    // console.log(doctorId)
    const objectId = new mongoose.Types.ObjectId(doctorId);
    // console.log(typeof objectId)

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ success: false, message: "Invalid doctor ID" });
    }


    const appointments = await Appointment.find({ doctorId: objectId });
    res.status(200).json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching appointments' });
  }
};

const getAppointmentsByPatient = async (req, res) => {
  const id = req.user._id;

  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid patient ID" });
  }

  try {
    const appointments = await Appointment.find({ patientId: id })
      .populate('doctorId', 'fullName profilePic') 
      .lean();

    res.status(200).json({ success: true, appointments });
  } catch (error) {

  }
}


export {
  getAppointmentsByDoctor,
  getAppointmentsByPatient
}