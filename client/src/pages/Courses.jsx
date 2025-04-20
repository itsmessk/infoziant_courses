import { useState, useEffect } from 'react';
import { getAllCourses } from '../utils/api';
import CourseCard from '../components/CourseCard';
import toast from 'react-hot-toast';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCourses();
        setCourses(data);
        setFilteredCourses(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        toast.error('Failed to load courses. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(term, selectedLevel, selectedPrice);
  };
  
  const handleLevelChange = (e) => {
    const level = e.target.value;
    setSelectedLevel(level);
    applyFilters(searchTerm, level, selectedPrice);
  };
  
  const handlePriceChange = (e) => {
    const price = e.target.value;
    setSelectedPrice(price);
    applyFilters(searchTerm, selectedLevel, price);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLevel('');
    setSelectedPrice('');
    setFilteredCourses(courses);
  };
  
  const applyFilters = (search, level, price) => {
    let result = [...courses];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        course => 
          course.title.toLowerCase().includes(searchLower) || 
          course.description.toLowerCase().includes(searchLower) ||
          course.instructor.toLowerCase().includes(searchLower) ||
          course.topics.some(topic => topic.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply level filter
    if (level) {
      result = result.filter(course => course.level === level);
    }
    
    // Apply price filter
    if (price) {
      switch (price) {
        case 'below-500':
          result = result.filter(course => course.price < 500);
          break;
        case '500-1000':
          result = result.filter(course => course.price >= 500 && course.price <= 1000);
          break;
        case '1000-1500':
          result = result.filter(course => course.price > 1000 && course.price <= 1500);
          break;
        case 'above-1500':
          result = result.filter(course => course.price > 1500);
          break;
        default:
          break;
      }
    }
    
    setFilteredCourses(result);
  };
  
  return (
    <div className="courses-page section">
      <div className="container">
        <h1 className="section-title text-center">Explore Our Courses</h1>
        
        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-filter">
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchTerm}
              onChange={handleSearch}
              className="form-control"
            />
          </div>
          
          <div className="filter-options">
            <div className="filter-group">
              <label htmlFor="level">Level:</label>
              <select 
                id="level" 
                value={selectedLevel} 
                onChange={handleLevelChange}
                className="form-control"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="price">Price:</label>
              <select 
                id="price" 
                value={selectedPrice} 
                onChange={handlePriceChange}
                className="form-control"
              >
                <option value="">All Prices</option>
                <option value="below-500">Below ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-1500">₹1000 - ₹1500</option>
                <option value="above-1500">Above ₹1500</option>
              </select>
            </div>
            
            <button 
              className="btn btn-secondary" 
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        {/* Courses Display */}
        {isLoading ? (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i> Loading courses...
          </div>
        ) : (
          <>
            {filteredCourses.length === 0 ? (
              <div className="no-courses">
                <p>No courses match your search criteria.</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="courses-grid">
                {filteredCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Courses; 