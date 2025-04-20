import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../utils/api';
import CourseCard from '../components/CourseCard';
import toast from 'react-hot-toast';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const courses = await getAllCourses();
        // Get featured courses 
        const featured = courses.filter(course => course.featured) || courses.slice(0, 3);
        setFeaturedCourses(featured);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        toast.error('Failed to load courses. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Learn Without Limits</h1>
            <p className="hero-subtitle">
              Discover world-class courses taught by industry experts to help you master in-demand skills and advance your career.
            </p>
            <Link to="/courses" className="btn btn-primary">
              Explore Courses
            </Link>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <div className="container">
        <div className="stats-container grid-cols-4">
          <div className="stat-item">
            <div className="stat-value">20+</div>
            <div className="stat-label">Expert Instructors</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">50+</div>
            <div className="stat-label">Quality Courses</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">5000+</div>
            <div className="stat-label">Happy Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">95%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      </div>
      
      {/* Featured Courses Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title text-center">Featured Courses</h2>
          
          {isLoading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i> Loading courses...
            </div>
          ) : (
            <div className="courses-grid">
              {featuredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
          
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/courses" className="btn btn-secondary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>
          
          <div className="grid grid-cols-3">
            <div className="feature-item text-center">
              <div className="icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>Find Your Course</h3>
              <p>Browse our diverse catalog of courses taught by industry experts.</p>
            </div>
            
            <div className="feature-item text-center">
              <div className="icon">
                <i className="fas fa-credit-card"></i>
              </div>
              <h3>Enroll & Pay</h3>
              <p>Secure payment options with our Razorpay integration.</p>
            </div>
            
            <div className="feature-item text-center">
              <div className="icon">
                <i className="fas fa-laptop"></i>
              </div>
              <h3>Learn & Succeed</h3>
              <p>Access course materials anytime and advance your career.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title text-center">What Our Students Say</h2>
          
          <div className="grid grid-cols-2">
            <div className="testimonial-item card">
              <div className="testimonial-content">
                <p>"The courses on Infoziant have helped me transition into a new career in web development. The instructors are amazing and the content is up-to-date."</p>
              </div>
              <div className="testimonial-author">
                <img src="https://i.pravatar.cc/100?img=1" alt="Student" className="testimonial-avatar" />
                <div className="testimonial-info">
                  <h4>Michael Brown</h4>
                  <p>Web Developer</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-item card">
              <div className="testimonial-content">
                <p>"I've taken several data science courses here, and the quality is consistently excellent. The hands-on projects really helped me apply what I learned."</p>
              </div>
              <div className="testimonial-author">
                <img src="https://i.pravatar.cc/100?img=5" alt="Student" className="testimonial-avatar" />
                <div className="testimonial-info">
                  <h4>Sarah Johnson</h4>
                  <p>Data Analyst</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Ready to Start Learning?</h2>
            <p>Join thousands of students already learning on Infoziant</p>
            <Link to="/register" className="btn btn-primary">Sign Up Now</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home; 