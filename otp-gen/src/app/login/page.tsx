'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage, FormDescription } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';

// Define the schema for OTP input
const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

export default function SignInForm() {
  const router = useRouter();
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false); // To track if OTP was sent
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Control modal visibility

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: '',
    },
  });

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send request to backend to send OTP
      const response = await axios.post('http://localhost:3001/send-otp', { phone, password });

      if (response.data.success) {
        setOtpSent(true);
        setIsModalOpen(true); // Open the OTP verification dialog
        toast({
          title: 'OTP sent successfully!',
          description: 'Please check your phone for the OTP.',
        });
      } else {
        toast({
          title: 'Failed to send OTP',
          description: 'There was an issue sending the OTP. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('SignIn error:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign in. Please check your credentials.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);

    try {
      const { pin } = data;
      console.log('Submitting OTP:', { phone, otp: pin }); // Log the data being sent

      const response = await axios.post('http://localhost:3001/verify-otp', {
        phone: phone,
        otp: pin,
      });

      if (response.data.success) {
        // Store the login state (e.g., token or flag in localStorage)
        localStorage.setItem('userToken', 'your-auth-token'); // This should be the actual token from the server
        toast({
          title: 'OTP Verified!',
          description: 'Your OTP has been successfully verified.',
        });
        router.push('/dashboard'); // Redirect to the dashboard
      } else {
        toast({
          title: 'OTP Verification Failed',
          description: 'The OTP you entered is incorrect. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Verification failed:', error);

      if (error.response) {
        console.error('Response Error:', error.response);
        toast({
          title: 'Error',
          description: `Verification failed: ${error.response.data?.message || 'Please try again.'}`,
          variant: 'destructive',
        });
      } else {
        console.error('Request Error:', error.message);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  }

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
              {loading ? 'Sending OTP...' : 'Please enter your credentials.'}
            </p>
          </form>
        </div>
      </div>

      {/* OTP Verification Dialog */}
      {otpSent && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger />
          <DialogContent>
            <DialogTitle>Verify OTP</DialogTitle> {/* Add DialogTitle for accessibility */}
            <DialogClose className="absolute top-4 right-4 text-gray-700 font-semibold hover:text-gray-900">
              X
            </DialogClose>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center mt-8">
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white w-full py-2 px-4 rounded-md hover:bg-blue-700"
                    disabled={loading}
                  >
                    Verify OTP
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
