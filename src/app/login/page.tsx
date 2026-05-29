'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { sendOTP } from '@/services/authApi';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await sendOTP(phone);
      router.push(`/otp?phone=${phone}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary-dark overflow-hidden relative">
      {/* Decorative Circles */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-12 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

      <div className="flex-1 flex flex-col px-6 py-12 z-10">
        <div className="flex-1 flex flex-col items-center justify-center mb-12">
          <div className="w-24 h-24 bg-white/10 rounded-3xl border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-md">
            <span className="text-5xl">🏠</span>
          </div>
          <h1 className="text-white text-5xl font-black mt-6 tracking-tighter">HomeOrbit</h1>
          <p className="text-white/60 font-medium mt-2 tracking-wide">Excellence in Society Living</p>
        </div>

        <div className="bg-white rounded-[36px] p-8 shadow-2xl border border-border">
          <form onSubmit={handleContinue} className="space-y-6">
            <div>
              <label className="text-[11px] font-black text-text-muted uppercase tracking-widest block mb-3 ml-1">
                MOBILE NUMBER
              </label>
              <div className="flex items-center h-16 bg-surface-alt border border-border rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-all">
                <div className="px-4 border-r border-divider h-full flex items-center">
                  <span className="text-lg font-bold text-text-primary">🇮🇳 +91</span>
                </div>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  className="flex-1 h-full bg-transparent px-4 text-xl font-bold text-text-primary placeholder:text-text-muted/50 focus:outline-none tracking-widest"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPhone(val);
                    setError('');
                  }}
                />
                {phone.length === 10 && (
                  <span className="pr-4 text-xl">✅</span>
                )}
              </div>
            </div>

            {error && (
              <p className="text-sm font-bold text-error text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-16 rounded-2xl text-lg font-bold shadow-colored(primary)"
              isLoading={loading}
            >
              Continue
            </Button>

            <div className="pt-4 text-center space-y-3">
              <p className="text-[11px] font-bold text-text-muted tracking-wide flex items-center justify-center gap-1.5">
                <span>🔒</span> Secured by 256-bit AES Encryption
              </p>
              <p className="text-[11px] text-text-muted leading-relaxed">
                By logging in, you agree to our <br />
                <span className="text-primary font-extrabold cursor-pointer">Terms</span> & <span className="text-primary font-extrabold cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
