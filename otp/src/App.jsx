import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import EnterPhoneNumber from './pages/login';
import VerifyOTP from './pages/otp';
import './index.css';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
      setStatusMessage('Please enter a valid phone number in E.164 format.');
      return;
    }
    setLoading(true);
    setStatusMessage('Sending OTP...');
    try {
      await axios.post('http://localhost:3001/send-otp', { phoneNumber });
      setStatusMessage('OTP sent successfully. Please verify.');
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('Failed to send OTP. Check console for details.');
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    if (otp.trim().length === 0) {
      setStatusMessage('Please enter the OTP.');
      return;
    }
    setLoading(true);
    setStatusMessage('Verifying OTP...');
    try {
      await axios.post('http://localhost:3001/verify-otp', { phoneNumber, otp });
      setStatusMessage('OTP verified successfully!');
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('Failed to verify OTP. Check console for details.');
    }
    setLoading(false);
  };

  return (
    <Router>
      <div className="App">
        <h1>OTP Sender and Verifier</h1>
        <Routes>
          <Route
            path="/"
            element={
              <EnterPhoneNumber
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                sendOTP={sendOTP}
                loading={loading}
                statusMessage={statusMessage}
              />
            }
          />
          <Route
            path="/verify-otp"
            element={
              <VerifyOTP
                otp={otp}
                setOtp={setOtp}
                verifyOTP={verifyOTP}
                loading={loading}
                statusMessage={statusMessage}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
