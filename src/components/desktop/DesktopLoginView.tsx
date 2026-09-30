import React, { useState } from 'react';
import {
  Phone,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  User,
  ArrowLeft
} from 'lucide-react';

export interface DesktopAuthUser {
  name: string;
  mobile: string;
  role: string;
  department: string;
  designation: string;
  district: string;
  isGuest: boolean;
  loginTime: string;
}

interface DesktopLoginViewProps {
  onLoginSuccess: (user: DesktopAuthUser) => void;
}

export const DesktopLoginView: React.FC<DesktopLoginViewProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobileNumber, setMobileNumber] = useState('9699317520');
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const cleaned = mobileNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      const code = cleaned === '9699317520' ? '969931' : '123456';
      setStep('otp');
      setOtpCode(code);
      setToastMsg(`OTP sent to +91 ${cleaned}: [ ${code} ]`);
      setTimeout(() => setToastMsg(null), 5000);
    }, 350);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMsg('Please enter the 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const cleaned = mobileNumber.replace(/\D/g, '');

      let user: DesktopAuthUser;
      if (cleaned === '9699317520') {
        user = {
          name: 'Dhairyashil',
          mobile: '9699317520',
          role: 'Lead Cadastral Surveyor & Drone Officer',
          department: 'Survey of India / PMRDA Cadastre Unit',
          designation: 'Chief Cadastral Surveyor',
          district: 'Pune',
          isGuest: false,
          loginTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };
      } else {
        user = {
          name: `Surveyor (${cleaned.slice(-4)})`,
          mobile: cleaned,
          role: 'Cadastral Surveyor',
          department: 'PMRDA Urban Cadastral Unit',
          designation: 'Field Surveyor',
          district: 'Pune',
          isGuest: false,
          loginTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };
      }

      localStorage.setItem('naksha_desktop_auth_user', JSON.stringify(user));
      onLoginSuccess(user);
    }, 400);
  };

  const handleGuestLogin = () => {
    const guestUser: DesktopAuthUser = {
      name: 'Guest Surveyor',
      mobile: 'N/A',
      role: 'Guest Cadastral Officer',
      department: 'Offline Workstation (Guest Access)',
      designation: 'Guest Officer',
      district: 'Pune',
      isGuest: true,
      loginTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
    localStorage.setItem('naksha_desktop_auth_user', JSON.stringify(guestUser));
    onLoginSuccess(guestUser);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#0f172a'
      }}
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            backgroundColor: '#065f46',
            color: '#ecfdf5',
            border: '1px solid #10b981',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            zIndex: 9999
          }}
        >
          <CheckCircle2 size={16} color="#34d399" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Clean Login Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Tricolor Government Strip */}
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)'
          }}
        />

        {/* Card Header: Just Login text */}
        <div style={{ padding: '28px 28px 12px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
            {step === 'phone' ? 'Login' : 'Enter OTP'}
          </h2>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            {step === 'phone'
              ? 'Enter your phone number to continue'
              : `Verification code sent to +91 ${mobileNumber}`}
          </p>
        </div>

        {/* Card Body */}
        <div style={{ padding: '16px 28px 28px' }}>
          {errorMsg && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '9px 12px',
                fontSize: '12.5px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                    Phone Number
                  </label>

                  {/* Guest Button right at the input section */}
                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    style={{
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '5px',
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e0f2fe';
                      e.currentTarget.style.color = '#0369a1';
                      e.currentTarget.style.borderColor = '#7dd3fc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.color = '#475569';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }}
                  >
                    <User size={11} />
                    <span>Guest</span>
                  </button>
                </div>

                {/* Input Container with +91 prefix */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s ease'
                  }}
                >
                  <span
                    style={{
                      padding: '11px 14px',
                      backgroundColor: '#f8fafc',
                      color: '#64748b',
                      fontSize: '13px',
                      fontWeight: 700,
                      borderRight: '1px solid #e2e8f0',
                      userSelect: 'none'
                    }}
                  >
                    +91
                  </span>

                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit number"
                    autoFocus
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: '11px 14px',
                      fontSize: '15px',
                      color: '#0f172a',
                      fontWeight: 600,
                      letterSpacing: '0.04em'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp || mobileNumber.length !== 10}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  backgroundColor: mobileNumber.length === 10 ? '#1b539c' : '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: mobileNumber.length === 10 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: mobileNumber.length === 10 ? '0 2px 8px rgba(27, 83, 156, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {isSendingOtp ? (
                  <>
                    <RotateCcw size={15} className="animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                    6-Digit OTP
                  </label>
                  <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>
                    Hint: 969931
                  </span>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="969931"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '20px',
                    fontWeight: 800,
                    letterSpacing: '0.3em',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    outline: 'none',
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || otpCode.length < 4}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  backgroundColor: otpCode.length >= 4 ? '#16a34a' : '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: otpCode.length >= 4 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: otpCode.length >= 4 ? '0 2px 8px rgba(22, 163, 74, 0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {isVerifying ? (
                  <>
                    <RotateCcw size={15} className="animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Login</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <div style={{ marginTop: '14px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setErrorMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ArrowLeft size={12} />
                  <span>Change phone number</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
