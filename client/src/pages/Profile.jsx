import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProfile, updateProfile, changePassword } from '../utils/api';
import toast from 'react-hot-toast';

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile();
        setProfile(data);
        setProfileForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || ''
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchProfile();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileForm.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileForm.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(profileForm.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (validateProfileForm()) {
      try {
        setIsSaving(true);
        const updatedProfile = await updateProfile(profileForm);
        
        // Update local user state and localStorage
        if (setUser) {
          setUser(prevUser => ({
            ...prevUser,
            name: updatedProfile.name,
            email: updatedProfile.email
          }));
          
          // Update localStorage
          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (storedUser) {
            localStorage.setItem('user', JSON.stringify({
              ...storedUser,
              name: updatedProfile.name,
              email: updatedProfile.email
            }));
          }
        }
        
        setProfile(updatedProfile);
        toast.success('Profile updated successfully');
      } catch (error) {
        console.error('Failed to update profile:', error);
        toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      try {
        setIsSaving(true);
        await changePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        });
        
        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        toast.success('Password changed successfully');
      } catch (error) {
        console.error('Failed to change password:', error);
        toast.error(error.response?.data?.message || 'Failed to change password. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };
  
  if (isLoading) {
    return <div className="loading">Loading profile...</div>;
  }
  
  return (
    <div className="profile-page">
      <div className="container">
        <div className="dashboard-container">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="user-info">
              <div className="user-avatar">
                <img src={profile?.profilePicture || "https://via.placeholder.com/80"} alt={profile?.name} />
              </div>
              <h3 className="user-name">{profile?.name}</h3>
              <p className="user-email">{profile?.email}</p>
            </div>
            
            <nav className="sidebar-nav">
              <Link to="/dashboard" className="sidebar-link">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>
              <Link to="/enrolled-courses" className="sidebar-link">
                <i className="fas fa-book"></i> My Courses
              </Link>
              <Link to="/payment-history" className="sidebar-link">
                <i className="fas fa-history"></i> Payment History
              </Link>
              <Link to="/profile" className="sidebar-link active">
                <i className="fas fa-user"></i> Profile Settings
              </Link>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="dashboard-content">
            <h2 className="dashboard-title">Profile Settings</h2>
            
            <div className="profile-tabs">
              <div className="tabs-header">
                <button 
                  className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Personal Information
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  Change Password
                </button>
              </div>
              
              <div className="tabs-content">
                {activeTab === 'profile' && (
                  <div className="tab-pane">
                    <form onSubmit={handleProfileSubmit}>
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          value={profileForm.name}
                          onChange={handleProfileChange}
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
                          value={profileForm.email}
                          onChange={handleProfileChange}
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number (Optional)</label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          className="form-control"
                          value={profileForm.phone}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </form>
                  </div>
                )}
                
                {activeTab === 'password' && (
                  <div className="tab-pane">
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                        />
                        {errors.currentPassword && <div className="error-message">{errors.currentPassword}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                        />
                        {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={isSaving}
                      >
                        {isSaving ? 'Changing Password...' : 'Change Password'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 