import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, Phone, ArrowRight, ShieldAlert, CheckCircle2, PlayCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const { 
    signupWithEmail, 
    loginWithEmail, 
    loginWithGoogle, 
    loginWithFacebook, 
    sendPhoneOtp, 
    verifyPhoneOtp, 
    enterDemoSandbox,
    hasValidFirebaseKeys,
    authError 
  } = useAuth();

  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'
  const [isSignUp, setIsSignUp] = useState(false);

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Phone state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signupWithEmail(email, password, displayName);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      console.error('Email auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setLoading(true);
    try {
      await sendPhoneOtp(phoneNumber.trim());
      setOtpSent(true);
    } catch (err) {
      console.error('Phone OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setLoading(true);
    try {
      await verifyPhoneOtp(otpCode.trim());
    } catch (err) {
      console.error('Verify OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAF8F5]/85 backdrop-blur-xl">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 relative shadow-2xl border border-white/80 animate-float">
        
        {/* Invisible Recaptcha Container */}
        <div id="recaptcha-container"></div>

        {/* Top Emblem */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FCE8EC] to-[#F0ECFC] text-[#E89CAE] mb-3 shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-[#2A2624]">
            Welcome to Aura
          </h1>
          <p className="text-xs text-[#7A726A] mt-1">
            Sign in or create your account powered by Firebase
          </p>
        </div>

        {/* Missing Firebase Credentials Banner */}
        {!hasValidFirebaseKeys && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#FAF5E4] border border-[#D4AF37]/40 text-xs text-[#6E5A1C] space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-[#594814]">
              <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
              <span>Firebase Credentials Required for Live Auth</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Create a <strong>.env</strong> file in your project root with your Firebase API keys, or click <strong>Preview Demo Sandbox</strong> below to explore the UI immediately!
            </p>
            <button
              type="button"
              onClick={enterDemoSandbox}
              className="w-full py-2 px-3 rounded-xl bg-[#D4AF37] text-white font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-xs"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Enter Interactive Demo Sandbox</span>
            </button>
          </div>
        )}

        {/* Auth Method Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F3EFEA] mb-5">
          <button
            type="button"
            onClick={() => { setAuthMethod('email'); setOtpSent(false); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              authMethod === 'email' ? 'bg-white text-[#2A2624] shadow-xs' : 'text-[#7A726A]'
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => { setAuthMethod('phone'); setOtpSent(false); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              authMethod === 'phone' ? 'bg-white text-[#2A2624] shadow-xs' : 'text-[#7A726A]'
            }`}
          >
            Phone SMS OTP
          </button>
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* 1. EMAIL FORM */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-[#4A423D] mb-1.5">Display Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C827A]" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivers"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs text-[#2A2624] placeholder-[#8C827A]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#4A423D] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C827A]" />
                <input
                  type="email"
                  required
                  placeholder="alex@aura.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs text-[#2A2624] placeholder-[#8C827A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A423D] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C827A]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs text-[#2A2624] placeholder-[#8C827A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E89CAE] to-[#B8A7EA] text-white font-semibold text-xs shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Processing...' : (isSignUp ? 'Sign Up with Email' : 'Sign In with Email')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. PHONE OTP FORM */}
        {authMethod === 'phone' && (
          !otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A423D] mb-1.5">Phone Number (with Country Code)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C827A]" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 234 567 8900"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs text-[#2A2624] placeholder-[#8C827A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#98B09A] to-[#B8A7EA] text-white font-semibold text-xs shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Sending SMS...' : 'Send SMS OTP Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 rounded-2xl bg-[#F0ECFC] text-xs text-[#B8A7EA] flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>OTP sent to {phoneNumber}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A423D] mb-1.5">Enter 6-Digit OTP Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg py-3 rounded-2xl glass-input font-bold text-[#2A2624]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#E89CAE] to-[#B8A7EA] text-white font-semibold text-xs shadow-md hover:scale-[1.02] transition-all"
              >
                {loading ? 'Verifying OTP...' : 'Verify OTP & Enter'}
              </button>
            </form>
          )
        )}

        <div className="my-5 flex items-center gap-3">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[10px] font-medium text-[#8C827A] uppercase tracking-wider">or social login</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {/* Social Buttons: Google & Facebook */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="py-2.5 px-3 rounded-2xl glass-input text-xs font-semibold text-[#2A2624] hover:bg-white transition-all flex items-center justify-center gap-2 border border-[#E1DAD0]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={loginWithFacebook}
            className="py-2.5 px-3 rounded-2xl glass-input text-xs font-semibold text-[#1877F2] hover:bg-white transition-all flex items-center justify-center gap-2 border border-[#E1DAD0]"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </button>
        </div>

        {/* Toggle Login / Register */}
        {authMethod === 'email' && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-[#7A726A] hover:text-[#E89CAE] font-medium transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'New to Aura? Register account'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
