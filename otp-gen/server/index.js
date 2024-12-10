import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// In-memory store to hold OTPs for validation (only store OTPs)
const otpStore = {};  // Store OTPs

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Endpoint to send OTP to a static phone number
app.post('/send-otp', (req, res) => {
  const phoneNumber = process.env.TWILIO_TO_PHONE_NUMBER;  // Static phone number
  const otp = Math.floor(100000 + Math.random() * 900000);  // Generate a 6-digit OTP

  otpStore[otp] = true;  // Store OTP, we no longer need to store phone number

  twilioClient.messages.create({
    to: phoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: `Your OTP is: ${otp}`,
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

// Endpoint to verify OTP
// Endpoint to verify OTP (no need for phone number anymore)
app.post('/verify-otp', (req, res) => {
    const { otp } = req.body;
  
    if (!otp) {
      return res.status(400).json({ success: false, message: 'OTP must be provided' });
    }
  
    const isValidOtp = otpStore[otp];  // Check if the OTP exists
  
    if (isValidOtp) {
      delete otpStore[otp];  // OTP matched, delete it to prevent reuse
      res.json({ success: true, message: 'OTP verified successfully!' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  });
  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
