import  { useState } from 'react';
import VerifyOTP from './otp';

function App() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const verifyOTP = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate OTP verification logic here
      if (otp === '1234') {
        setStatusMessage('OTP Verified Successfully!');
      } else {
        setStatusMessage('Invalid OTP. Please try again.');
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="App">
      <VerifyOTP
        otp={otp}
        setOtp={setOtp}
        verifyOTP={verifyOTP}
        loading={loading}
        statusMessage={statusMessage}
      />
    </div>
  );
}

export default App;
