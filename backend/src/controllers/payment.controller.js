import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Appointment } from "../models/appointment.model.js";
// import globals from 'node-global-storage/dist/index.js'
// import paymentModel from '../model/paymentModel.js'

export const payment_create = async (req, res) => {
  const { amount, doctorId, patientId, timeSlot, date } = req.body;

  // globals.set('userId', userId)

  // console.log('I am here in controller')
  // console.log('reqest ID token: ', req.id_token )

  try {
    const { data } = await axios.post(
      process.env.bkash_create_payment_url,
      {
        mode: "0011",
        payerReference: " ",
        callbackURL: "http://localhost:8000/api/v1/payment/bkash/callback",
        amount: amount,
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: `Inv-${uuidv4().substring(0, 5)}-${
          doctorId._id
        }-${patientId}-${timeSlot}-${date}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: req.id_token,
          "x-app-key": process.env.bkash_api_key,
        },
      }
    );

    return res.status(200).json({ bkashURL: data.bkashURL });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

// 🧾 Callback Handler
export const call_back = async (req, res) => {
  const { paymentID, status } = req.query;

  if (status === "cancel" || status === "failure") {
    return res.redirect(
      `http://localhost:5173/app/bkash-payment/error?message=${status}`
    );
  }

  if (status === "success") {
    try {
      const { data } = await axios.post(
        process.env.bkash_execute_payment_url,
        { paymentID },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: req.id_token,
            "x-app-key": process.env.bkash_api_key,
          },
        }
      );

      if (data && data.statusCode === "0000") {
        const invoiceParts = data.merchantInvoiceNumber.split("-");
        const doctorId = invoiceParts[2]; // correct index for doctorId
        const patientId = invoiceParts[3]; // correct index for patientId
        const timeSlot = invoiceParts[4]
        const date = invoiceParts[5]

               await Appointment.findOneAndUpdate(
          {
            doctorId,
            patientId,
            timeSlot,
            date,
          },
          {
            payment: "paid",
            status: "confirmed",
          },
          { new: true }
        );

        return res.redirect(`http://localhost:5173/app/bkash-payment/success`);
      } else {
        return res.redirect(
          `http://localhost:5173/app/bkash-payment/error?message=${data.statusMessage}`
        );
      }
    } catch (error) {
      console.error(error);
      return res.redirect(
        `http://localhost:5173/app/bkash-payment/error?message=${error.message}`
      );
    }
  }
};

export const refund = async (req, res) => {};
// 💸 Refund Handler
// export const refund = async (req, res) => {
//     const { trxID } = req.params

//     try {
//         const payment = await paymentModel.findOne({ trxID })

//         const { data } = await axios.post(
//             process.env.bkash_refund_transaction_url,
//             {
//                 paymentID: payment.paymentID,
//                 amount: payment.amount,
//                 trxID,
//                 sku: 'payment',
//                 reason: 'cashback',
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Accept: 'application/json',
//                     authorization: req.id_token,
//                     'x-app-key': process.env.bkash_api_key,
//                 },
//             }
//         )

//         if (data && data.statusCode === '0000') {
//             return res.status(200).json({ message: 'refund success' })
//         } else {
//             return res.status(404).json({ error: 'refund failed' })
//         }
//     } catch (error) {
//         return res.status(404).json({ error: 'refund failed' })
//     }
// }
