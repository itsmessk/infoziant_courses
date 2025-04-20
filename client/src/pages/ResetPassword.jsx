import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword, verifyResetToken } from '../utils/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  
  // Verify reset token when component loads
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setTokenChecked(true);
        return;
      }
      
      try {
        setIsLoading(true);
        await verifyResetToken(token);
        setIsTokenValid(true);
      } catch (error) {
        console.error('Invalid or expired token:', error);
        setIsTokenValid(false);
      } finally {
        setIsLoading(false);
        setTokenChecked(true);
      }
    };
    
    checkToken();
  }, [token]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsLoading(true);
        await resetPassword(token, { password: formData.password });
        toast.success('Password has been reset successfully');
        navigate('/login', { state: { passwordReset: true } });
      } catch (error) {
        console.error('Password reset failed:', error);
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'Password reset failed. Please try again.';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  if (!tokenChecked) {
    return <div className="loading">Verifying your reset link...</div>;
  }
  
  if (tokenChecked && !isTokenValid) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="auth-container">
            <h2 className="auth-title">Invalid or Expired Link</h2>
            <div className="error-message text-center mb-4">
              <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: 'var(--error-color)', marginBottom: '1rem' }}></i>
              <p>
                The password reset link you used is invalid or has expired.
                Please request a new link.
              </p>
            </div>
            <div className="text-center">
              <Link to="/forgot-password" className="btn btn-primary">
                Request New Link
              </Link>
            </div>
            <div className="auth-footer">
              <Link to="/login">Back to Login</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <h2 className="auth-title">Reset Your Password</h2>
          <p className="auth-subtitle">
            Enter your new password below.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your new password"
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
              />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
          
          <div className="auth-footer">
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 