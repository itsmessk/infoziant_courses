import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/api';
import toast from 'react-hot-toast';

const Register = ({ handleLogin, user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
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
        const userData = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        // Check if email verification is required
        if (userData.requiresVerification) {
          setRegistrationSuccess(true);
          toast.success('Registration successful! Please check your email to verify your account.');
        } else {
          // Direct login if no verification required
          if (userData && userData.token) {
            handleLogin(userData);
            toast.success('Registration successful!');
            navigate('/dashboard');
          } else {
            toast.error('Registration failed: Invalid response from server');
          }
        }
      } catch (error) {
        console.error('Registration failed:', error);
        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'Registration failed. Please try again.';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  if (registrationSuccess) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="auth-container">
            <div className="success-message text-center">
              <i className="fas fa-envelope" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
              <h2 className="auth-title">Verify Your Email</h2>
              <p className="mb-4">
                Thanks for signing up! We've sent a verification email to <strong>{formData.email}</strong>.
                <br /><br />
                Please check your inbox and click on the verification link to activate your account.
              </p>
              <div className="buttons-group">
                <Link to="/login" className="btn btn-secondary">
                  Go to Login
                </Link>
                <Link to="/resend-verification" className="btn btn-primary ml-2" state={{ email: formData.email }}>
                  Resend Verification Email
                </Link>
              </div>
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
          <h2 className="auth-title">Create an Account</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            
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
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 