import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = ({ user, handleLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleNavLogout = () => {
    handleLogout();
    setIsMobileMenuOpen(false);
  };
  
  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="logo">
            <Link to="/">
              <img src="/logo.png" alt="Infoziant" />
              <span>Infoziant</span>
            </Link>
          </div>
          
          <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <ul>
              <li>
                <Link 
                  to="/" 
                  className={location.pathname === '/' ? 'active' : ''}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/courses" 
                  className={location.pathname === '/courses' ? 'active' : ''}
                >
                  Courses
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link 
                      to="/dashboard" 
                      className={location.pathname === '/dashboard' ? 'active' : ''}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/enrolled-courses" 
                      className={location.pathname === '/enrolled-courses' ? 'active' : ''}
                    >
                      My Courses
                    </Link>
                  </li>
                  <li>
                    <button className="btn-logout" onClick={handleNavLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className={location.pathname === '/login' ? 'active' : ''}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className="btn btn-primary"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 