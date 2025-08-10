import express from 'express'
import { jwtVerify } from '../middlewares/auth.middleware.js';
import { getAppointmentsByDoctor, getAppointmentsByPatient } from '../controllers/appointment.controller.js';
import { bkash_auth } from '../middlewares/bkash_auth.middleware.js';
import { call_back, payment_create, refund } from '../controllers/payment.controller.js';



const paymentRouter = express.Router()

paymentRouter.post('/bkash/create', jwtVerify, bkash_auth, payment_create)
paymentRouter.get('/bkash/callback',  bkash_auth, call_back)
paymentRouter.get('/bkash/refund/:trxID', jwtVerify, bkash_auth, refund)




export default paymentRouter;