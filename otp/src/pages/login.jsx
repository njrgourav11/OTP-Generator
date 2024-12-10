import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define types for the component's state
interface SignInFormState {
    phone: string;
    password: string;
    otp: string;
    statusMessage: string;
    loading: boolean;
    otpSent: boolean;
}

function SignInForm() {
    const [phone, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [otpSent, setOtpSent] = useState<boolean>(false); // To track if OTP has been sent
    const navigate = useNavigate();

    // Handle SignIn form submission
    const handleSignIn = async (e: FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        setStatusMessage('Processing...');
        setLoading(true);

        try {
            // Simulate API call for login/OTP request
            const response = await axios.post('http://localhost:3001/send-otp', { phone, password });
            setOtpSent(true);
            setStatusMessage('OTP sent successfully. Please verify.');
            setLoading(false);
            navigate('/verify-otp'); // Navigate to OTP verification page
        } catch (error) {
            console.error('SignIn error:', error);
            setStatusMessage('Failed to sign in. Check credentials.');
            setLoading(false);
        }
    };

    // Handle OTP submission
    const handleOtpSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (otp.trim().length === 0) {
            setStatusMessage('Please enter the OTP.');
            return;
        }
        setLoading(true);
        setStatusMessage('Verifying OTP...');

        try {
            // Simulate API call to verify OTP
            await axios.post('http://localhost:3001/verify-otp', { phone, otp });
            setStatusMessage('OTP verified successfully!');
            setLoading(false);
            // Handle success (e.g., redirect to dashboard)
        } catch (error) {
            console.error('OTP Verification error:', error);
            setStatusMessage('Failed to verify OTP.');
            setLoading(false);
        }
    };

    return (
        <div className="font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
                    <div>
                        <h2 className="lg:text-5xl text-4xl font-extrabold lg:leading-[55px] text-gray-800">
                            Seamless Signup for Exclusive Access
                        </h2>
                        <p className="text-sm mt-6 text-gray-800">
                            Immerse yourself in a hassle-free signup journey with our intuitively designed signup form. Effortlessly access your account.
                        </p>
                        <p className="text-sm mt-12 text-gray-800">
                            Don't have an account{' '}
                            <a href="#" className="text-blue-600 font-semibold hover:underline ml-1">
                                Register here
                            </a>
                        </p>
                    </div>

                    <form className="max-w-md md:ml-auto w-full" onSubmit={handleSignIn}>
                        <h3 className="text-gray-800 text-3xl font-extrabold mb-8">
                            Sign In
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="phone"
                                    name="phone"
                                    autoComplete="phone"
                                    required
                                    className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                                    placeholder="+917606914711"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="text-blue-600 hover:text-blue-500 font-semibold">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="!mt-8">
                            <button
                                type="submit"
                                className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                disabled={loading}
                            >
                                {loading ? 'Sending OTP...' : 'Log in'}
                            </button>
                        </div>

                        <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-4">
                            {statusMessage}
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignInForm;
