import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEnrolledCourses } from '../utils/api';
import toast from 'react-hot-toast';

const EnrolledCourses = ({ user }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setIsLoading(true);
        const coursesData = await getEnrolledCourses();
        setCourses(coursesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch enrolled courses:', error);
        toast.error('Failed to load your courses. Please try again later.');
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchEnrolledCourses();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (isLoading) {
    return <div className="loading">Loading your courses...</div>;
  }
  
  return (
    <div className="enrolled-courses-page">
      <div className="container">
        <div className="dashboard-container">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="user-info">
              <div className="user-avatar">
                <img src={user?.profilePicture || "https://via.placeholder.com/80"} alt={user?.name} />
              </div>
              <h3 className="user-name">{user?.name}</h3>
              <p className="user-email">{user?.email}</p>
            </div>
            
            <nav className="sidebar-nav">
              <Link to="/dashboard" className="sidebar-link">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>
              <Link to="/enrolled-courses" className="sidebar-link active">
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
            <h2 className="dashboard-title">My Enrolled Courses</h2>
            
            {courses.length === 0 ? (
              <div className="no-courses">
                <p>You haven't enrolled in any courses yet.</p>
                <Link to="/courses" className="btn btn-primary">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="enrolled-courses-grid">
                {courses.map((course) => (
                  <div key={course._id} className="course-card card">
                    <div className="course-image">
                      <img src={course.image} alt={course.title} />
                      <div className="course-level">{course.level}</div>
                    </div>
                    <div className="course-content">
                      <h3 className="course-title">
                        <Link to={`/courses/${course._id}`}>{course.title}</Link>
                      </h3>
                      <div className="course-details">
                        <div className="course-instructor">
                          <i className="fas fa-user"></i> {course.instructor}
                        </div>
                        <div className="course-duration">
                          <i className="fas fa-clock"></i> {course.duration}
                        </div>
                      </div>
                      <div className="course-progress">
                        <div className="progress-label">
                          <span>Progress</span>
                          <span>{Math.floor(Math.random() * 100)}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="course-footer">
                        <Link to={`/courses/${course._id}`} className="btn btn-primary">
                          Continue Learning
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourses; 