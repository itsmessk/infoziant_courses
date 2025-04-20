import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { verifyEmail } from '../utils/api';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('Verification token is missing.');
        setIsLoading(false);
        return;
      }
      
      try {
        await verifyEmail(token);
        setIsVerified(true);
        toast.success('Email verified successfully!');
      } catch (error) {
        console.error('Email verification failed:', error);
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'Email verification failed. Please try again.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    verify();
  }, [token]);
  
  if (isLoading) {
    return (
      <div className="container">
        <div className="loading text-center">
          <i className="fas fa-spinner fa-spin"></i> Verifying your email...
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          {isVerified ? (
            <>
              <div className="success-message text-center">
                <i className="fas fa-check-circle" style={{ fontSize: '4rem', color: 'var(--success-color)', marginBottom: '1.5rem' }}></i>
                <h2 className="auth-title">Email Verified!</h2>
                <p className="mb-4">
                  Your email has been successfully verified. You can now log in to your account.
                </p>
                <Link to="/login" className="btn btn-primary">
                  Go to Login
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="error-message text-center">
                <i className="fas fa-exclamation-circle" style={{ fontSize: '4rem', color: 'var(--error-color)', marginBottom: '1.5rem' }}></i>
                <h2 className="auth-title">Verification Failed</h2>
                <p className="mb-4">
                  {error || 'The verification link may be invalid or expired.'}
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/login" className="btn btn-secondary">
                    Go to Login
                  </Link>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/resend-verification')}
                  >
                    Resend Verification Email
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 