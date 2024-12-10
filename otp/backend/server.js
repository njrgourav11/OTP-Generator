const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = 3001;

// Assuming this is for development and simplicity. In production, consider using Redis or a database.
const otpStore = {};

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/send-otp', (req, res) => {
  const phoneNumber = process.env.TWILIO_TO_PHONE_NUMBER;
  const otp = Math.floor(100000 + Math.random() * 900000);  // Generate a 6-digit OTP

    otpStore[phoneNumber] = otp;  // Store the OTP indexed by phone number


    twilioClient.messages.create({
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Your OTP is: ${otp}`
    })
    .then(message => {
        console.log(`Message sent with SID: ${message.sid}`);
        res.json({ success: true, message: 'OTP sent successfully!' });
    })
    .catch(error => {
        console.error('Sending OTP failed:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
    });
});

app.post('/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
      return res.status(400).json({ success: false, message: 'Phone number and OTP must be provided' });
  }

  const validOtp = otpStore[phoneNumber];
  if (otp == validOtp) {
      delete otpStore[phoneNumber];  // Remove OTP from store after successful verification
      res.json({ success: true, message: 'OTP verified successfully!' });
  } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
