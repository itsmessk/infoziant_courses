import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProfile, getEnrolledCourses } from '../utils/api';
import toast from 'react-hot-toast';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const profileData = await getUserProfile();
        const coursesData = await getEnrolledCourses();
        
        setProfile(profileData);
        setEnrolledCourses(coursesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast.error('Failed to load dashboard data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchUserData();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (isLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }
  
  return (
    <div className="dashboard-page">
      <div className="container">
        <h1 className="page-title">Dashboard</h1>
        
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
              <Link to="/dashboard" className="sidebar-link active">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>
              <Link to="/enrolled-courses" className="sidebar-link">
                <i className="fas fa-book"></i> My Courses
              </Link>
              <Link to="/payment-history" className="sidebar-link">
                <i className="fas fa-history"></i> Payment History
              </Link>
              <Link to="/profile" className="sidebar-link">
                <i className="fas fa-user"></i> Profile Settings
              </Link>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="dashboard-content">
            <div className="welcome-message">
              <h2>Welcome back, {profile?.name}!</h2>
              <p>Track your progress and continue learning where you left off.</p>
            </div>
            
            {/* Dashboard Stats */}
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-book"></i>
                </div>
                <div className="stat-info">
                  <h3 className="stat-value">{enrolledCourses.length}</h3>
                  <p className="stat-label">Enrolled Courses</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-info">
                  <h3 className="stat-value">12h 30m</h3>
                  <p className="stat-label">Total Learning Time</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-certificate"></i>
                </div>
                <div className="stat-info">
                  <h3 className="stat-value">{enrolledCourses.filter(course => 
                    Math.random() > 0.5).length}</h3>
                  <p className="stat-label">Completed Courses</p>
                </div>
              </div>
            </div>
            
            {/* Recent Courses */}
            <div className="recent-courses">
              <div className="section-header">
                <h3>Your Recent Courses</h3>
                <Link to="/enrolled-courses" className="view-all">View All</Link>
              </div>
              
              {enrolledCourses.length === 0 ? (
                <div className="no-courses">
                  <p>You haven't enrolled in any courses yet.</p>
                  <Link to="/courses" className="btn btn-primary">
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="courses-list">
                  {enrolledCourses.slice(0, 3).map((course) => (
                    <div key={course._id} className="course-item">
                      <div className="course-thumbnail">
                        <img src={course.image} alt={course.title} />
                      </div>
                      <div className="course-info">
                        <h4 className="course-title">
                          <Link to={`/courses/${course._id}`}>{course.title}</Link>
                        </h4>
                        <div className="course-meta">
                          <span className="instructor">{course.instructor}</span>
                          <span className="progress">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                              ></div>
                            </div>
                            <span className="progress-text">In Progress</span>
                          </span>
                        </div>
                      </div>
                      <Link to={`/courses/${course._id}`} className="btn-continue">
                        Continue <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
