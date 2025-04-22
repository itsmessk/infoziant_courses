import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, createPaymentOrder } from '../utils/api';
import MockPayment from '../components/MockPayment';
import toast from 'react-hot-toast';

const CourseDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone: ''
  });
  
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getCourseById(id);
        setCourse(data);
        
        // Check if user is enrolled
        if (user && user.courses) {
          setIsEnrolled(user.courses.includes(id));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch course details:', error);
        toast.error('Failed to load course details. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [id, user]);
  
  const handleEnrollment = () => {
    // Open user info modal directly without login check
    setShowUserInfoModal(true);
  };
  
  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Save user info to database in course_cop collection
      const response = await fetch('/api/enrollment/guest-enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseId: id,
          courseName: course?.title,
          coursePrice: course?.price,
          ...userInfo
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save user information');
      }
      
      // Close user info modal
      setShowUserInfoModal(false);
      
      // Create payment order and show payment modal
      try {
        const data = await createPaymentOrder(id, userInfo.email, userInfo.name);
        setOrderData(data);
        setShowPaymentModal(true);
      } catch (error) {
        console.error('Failed to create payment order:', error);
        toast.error('Failed to create payment order. Please try again later.');
      }
    } catch (error) {
      console.error('Failed to process enrollment:', error);
      toast.error('Failed to process enrollment. Please try again later.');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePaymentSuccess = () => {
    // Update enrollment record with payment status
    fetch('/api/enrollment/update-payment-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userInfo.email,
        courseId: id,
        paymentStatus: 'completed'
      })
    }).catch(err => console.error('Error updating payment status:', err));
    
    setIsEnrolled(true);
    setShowPaymentModal(false);
    toast.success('Payment successful! You are now enrolled in this course.');
  };
  
  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };
  
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i> Loading course details...
      </div>
    );
  }
  
  if (!course) {
    return <div className="not-found">Course not found</div>;
  }
  
  return (
    <div className="course-details-page section">
      <div className="container">
        {/* Course Header */}
        <div className="course-details">
          <div className="course-details-main">
            <h1 className="course-details-title">{course.title}</h1>
            
            <div className="course-details-meta">
              <div>
                <i className="fas fa-user"></i> Instructor: {course.instructor}
              </div>
              <div>
                <i className="fas fa-signal"></i> Level: {course.level}
              </div>
              <div>
                <i className="fas fa-clock"></i> Duration: {course.duration}
              </div>
              <div>
                <i className="fas fa-users"></i> Students: {course.enrollmentCount || 0}
              </div>
            </div>
            
            <img 
              src={course.image} 
              alt={course.title}
              className="course-details-image"
            />
            
            {/* Course Tabs */}
            <div className="course-tabs">
              <div className="tabs-header">
                <button 
                  className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
                  onClick={() => setActiveTab('curriculum')}
                >
                  Curriculum
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'instructor' ? 'active' : ''}`}
                  onClick={() => setActiveTab('instructor')}
                >
                  Instructor
                </button>
              </div>
              
              <div className="tabs-content">
                {activeTab === 'overview' && (
                  <div className="tab-pane">
                    <h3>Course Description</h3>
                    <p className="course-details-description">{course.description}</p>
                    
                    <h3>What You'll Learn</h3>
                    <ul className="topics-list">
                      {course.topics.map((topic, index) => (
                        <li key={index}>
                          <i className="fas fa-check"></i> {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeTab === 'curriculum' && (
                  <div className="tab-pane">
                    <h3>Course Curriculum</h3>
                    {course.curriculum && course.curriculum.length > 0 ? (
                      course.curriculum.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="curriculum-section">
                          <h4 className="section-title">
                            {section.title}
                          </h4>
                          <ul className="lessons-list">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex} className="lesson-item">
                                <div className="lesson-info">
                                  <span className="lesson-title">
                                    <i className="fas fa-play-circle"></i> {lesson.title}
                                  </span>
                                  <span className="lesson-duration">{lesson.duration}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p>Curriculum details will be available soon.</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'instructor' && (
                  <div className="tab-pane">
                    <h3>About the Instructor</h3>
                    <div className="instructor-profile">
                      <div className="instructor-image">
                        <img src={`https://i.pravatar.cc/150?u=${course.instructor}`} alt={course.instructor} />
                      </div>
                      <div className="instructor-info">
                        <h4>{course.instructor}</h4>
                        <p>
                          Experienced instructor with expertise in {course.topics.slice(0, 2).join(', ')}, 
                          and other related technologies. Passionate about teaching and helping 
                          students master complex concepts through practical examples.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Course Sidebar */}
          <div className="course-sidebar">
            <div className="course-sidebar-price">₹{course.price}</div>
            
            <div className="course-features">
              <div className="course-feature">
                <i className="fas fa-play-circle"></i>
                <span>Full lifetime access</span>
              </div>
              <div className="course-feature">
                <i className="fas fa-mobile-alt"></i>
                <span>Access on mobile and desktop</span>
              </div>
              <div className="course-feature">
                <i className="fas fa-certificate"></i>
                <span>Certificate of completion</span>
              </div>
              <div className="course-feature">
                <i className="fas fa-comments"></i>
                <span>Instructor support</span>
              </div>
            </div>
            
            {isEnrolled ? (
              <button className="btn btn-success enroll-button" disabled>
                Already Enrolled
              </button>
            ) : (
              <button className="btn btn-primary enroll-button" onClick={handleEnrollment}>
                Enroll Now
              </button>
            )}
            
            <div className="money-back">
              <i className="fas fa-shield-alt"></i>
              <span>30-Day Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Information Modal */}
      {showUserInfoModal && (
        <div className="modal-overlay">
          <div className="modal-content user-info-modal">
            <h2>Complete Your Enrollment</h2>
            <p>Please provide the following information to continue with course enrollment.</p>
            
            <form onSubmit={handleUserInfoSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  placeholder="10-digit number"
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserInfoModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Mock Payment Modal */}
      {showPaymentModal && orderData && (
        <MockPayment 
          order={orderData} 
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
};

export default CourseDetails;