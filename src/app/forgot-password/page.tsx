'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement password reset
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to login</span>
        </Link>

        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-white/60 mb-8">
            {isSent
              ? 'Check your email for a password reset link.'
              : 'Enter your email address and we\'ll send you a link to reset your password.'}
          </p>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-white/90 font-semibold h-12 text-base"
                isLoading={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <Mail className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-white/80 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
