import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../utils/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await requestPasswordReset({ email });
      setIsSubmitted(true);
      toast.success('Password reset instructions have been sent to your email');
    } catch (error) {
      console.error('Error requesting password reset:', error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to send reset link. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <h2 className="auth-title">Forgot Password</h2>
          
          {!isSubmitted ? (
            <>
              <p className="auth-subtitle">
                Enter your email address below and we'll send you instructions to reset your password.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                  />
                  {error && <div className="error-message">{error}</div>}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-block" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="success-message text-center">
              <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: 'var(--success-color)', marginBottom: '1rem' }}></i>
              <h3>Email Sent</h3>
              <p>
                We've sent password reset instructions to {email}.<br />
                Please check your inbox and follow the instructions.
              </p>
            </div>
          )}
          
          <div className="auth-footer">
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 