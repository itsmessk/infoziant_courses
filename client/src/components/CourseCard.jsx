import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const formatPrice = (price) => {
    return `₹${price}`;
  };

  return (
    <div className="course-card card">
      <img 
        src={course.image} 
        alt={course.title} 
        className="course-image"
      />
      <div className="course-content">
        <h3 className="course-title">
          <Link to={`/courses/${course._id}`}>{course.title}</Link>
        </h3>
        <p className="course-instructor">
          <i className="fas fa-user"></i> {course.instructor}
        </p>
        <p className="course-description">
          {course.description.length > 100 
            ? `${course.description.substring(0, 100)}...` 
            : course.description}
        </p>
        <div className="course-meta">
          <div className="course-rating">
            <i className="fas fa-star"></i> 
            <span>{course.rating || 0}</span>
            {course.enrollmentCount && (
              <span className="enrollment-count">({course.enrollmentCount} students)</span>
            )}
          </div>
          <div className="course-price">{formatPrice(course.price)}</div>
        </div>
        <div className="course-footer">
          <span className="course-level">
            <i className="fas fa-signal"></i> {course.level}
          </span>
          <span className="course-duration">
            <i className="fas fa-clock"></i> {course.duration}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 