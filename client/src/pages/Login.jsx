import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../utils/api';
import toast from 'react-hot-toast';

const Login = ({ handleLogin, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Show success message if redirected from password reset
  useEffect(() => {
    if (location.state?.passwordReset) {
      toast.success('Your password has been reset. You can now log in with your new password.');
    }
    if (location.state?.emailVerified) {
      toast.success('Your email has been verified. You can now log in.');
    }
  }, [location.state]);
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
        const userData = await loginUser(formData);
        
        // Verify we received both user data and token
        if (userData && userData.token) {
          handleLogin(userData);
          toast.success('Login successful!');
          navigate('/dashboard');
        } else {
          toast.error('Login failed: Invalid response from server');
        }
      } catch (error) {
        console.error('Login failed:', error);
        // Check different levels of error response
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'Login failed. Please try again.';
          
        // Special handling for unverified email
        if (error.response?.status === 403 && error.response?.data?.needsVerification) {
          toast.error('Your email is not verified. Please check your inbox for verification email.');
          navigate('/resend-verification', { state: { email: formData.email } });
          return;
        }
        
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Demo login for test purposes - only shown for non-registered users
  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const demoCredentials = {
        email: 'demo@example.com',
        password: 'demo123'
      };
      
      const userData = await loginUser(demoCredentials);
      handleLogin(userData);
      toast.success('Demo login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Demo login failed:', error);
      toast.error('Demo login failed. Please try normal login.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <h2 className="auth-title">Login to Your Account</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
              <div className="text-right mt-1">
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            {/* Only show demo login if we need to for testing */}
            {process.env.NODE_ENV === 'development' && (
              <button 
                onClick={handleDemoLogin}
                className="btn btn-secondary btn-block"
                disabled={isLoading}
                style={{ marginTop: '10px' }}
              >
                Use Demo Account
              </button>
            )}
          </form>
          
          <div className="auth-footer">
            <div>Don't have an account? <Link to="/register">Sign up</Link></div>
            <div className="mt-2">
              <Link to="/resend-verification">Resend verification email</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 