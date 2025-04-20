import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-title">Infoziant</h3>
            <p className="footer-description">
              Empowering students with high-quality courses to master in-demand skills and advance their careers.
            </p>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-subtitle">Support</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-subtitle">Contact</h4>
            <div className="contact-info">
              <p><i className="fas fa-map-marker-alt"></i> 123 Education St, Learning City</p>
              <p><i className="fas fa-envelope"></i> info@Infoziant.com</p>
              <p><i className="fas fa-phone"></i> +1 234 567 8900</p>
            </div>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} Infoziant. All rights reserved.
          </p>
          <div className="payment-methods">
            <img src="/payments.png" alt="Payment Methods" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 