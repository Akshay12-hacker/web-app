'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { verifyOTP, sendOTP } from '@/services/authApi';
import { useAuth } from '@/providers/AuthProvider';
import { useCountdown } from '@/hooks/useCountdown';

const OTP_LENGTH = 6;

function OTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const { login } = useAuth();
  
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { count, expired, reset } = useCountdown(30);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (val: string, idx: number) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    setError('');

    if (digit && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }

    if (next.join('').length === OTP_LENGTH) {
      handleVerify(next.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async (codeStr?: string) => {
    const code = codeStr || otp.join('');
    if (code.length < OTP_LENGTH) return;

    setLoading(true);
    setError('');
    try {
      const session = await verifyOTP(phone, code);
      await login(session);
      
      // Navigate to society selection or home
      router.push('/society');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    reset();
    setOtp(Array(OTP_LENGTH).fill(''));
    try {
      await sendOTP(phone);
    } catch (err) {}
    setResending(false);
    inputRefs.current[0]?.focus();
  };

  const maskedPhone = `+91 ${phone.slice(0, 2)}XXXXX${phone.slice(-3)}`;

  return (
    <div className="flex flex-col min-h-screen bg-primary-dark overflow-hidden relative">
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-12 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

      <div className="flex-1 flex flex-col px-6 py-12 z-10">
        <div className="flex-1 flex flex-col items-center justify-center mb-12">
          <div className="w-20 h-20 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center shadow-xl backdrop-blur-md mb-6">
            <span className="text-4xl">🔐</span>
          </div>
          <h1 className="text-white text-3xl font-black tracking-tight">Verification</h1>
          <p className="text-white/60 font-medium mt-2">We've sent a 6-digit code to</p>
          <p className="text-primary font-bold mt-1 text-lg">{maskedPhone}</p>
        </div>

        <div className="w-full space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`w-12 h-16 rounded-2xl border-2 text-center text-2xl font-black transition-all outline-none
                  ${digit ? 'border-primary bg-white text-text-primary' : 'border-white/20 bg-white/10 text-white'}
                  ${error ? 'border-error' : ''}
                  focus:border-primary focus:bg-white focus:text-text-primary
                `}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm font-bold text-error text-center">{error}</p>
          )}

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleResend}
              disabled={!expired || resending}
              className={`text-sm font-bold transition-colors ${!expired ? 'text-white/40' : 'text-primary'}`}
            >
              {resending ? 'Sending...' : !expired ? `Resend in ${count}s` : 'Resend Code'}
            </button>

            <Button
              className="w-full h-16 rounded-2xl text-lg font-bold"
              onClick={() => handleVerify()}
              isLoading={loading}
              disabled={otp.join('').length < OTP_LENGTH}
            >
              Continue
            </Button>

            <button
              onClick={() => router.back()}
              className="text-white/60 text-sm font-bold underline underline-offset-4"
            >
              Change Mobile Number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary-dark flex items-center justify-center text-white">Loading...</div>}>
      <OTPContent />
    </Suspense>
  );
}
