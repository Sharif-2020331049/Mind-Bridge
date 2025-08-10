import express from 'express'
import cors from 'cors'

import patientRouter from './routes/patient.route.js'
import doctorRouter from './routes/doctor.route.js'
import appointmentRouter from './routes/appointment.route.js'
import paymentRouter from './routes/payment.route.js'


const app = express()

// Middlewares 
app.use([cors(), express.json(), express.urlencoded({extended: true})])
app.use('/api/v1/patient', patientRouter)
app.use('/api/v1/doctor', doctorRouter)
app.use('/api/v1/appointment', appointmentRouter)
app.use('/api/v1/payment', paymentRouter)





export { app }