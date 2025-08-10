import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
      doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Doctor", 
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Patient",
    },
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    payment: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    }

  },
  {
    timestamps: true,
  }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
