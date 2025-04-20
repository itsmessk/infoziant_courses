import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EnrolledCourses from './pages/EnrolledCourses';
import PaymentHistory from './pages/PaymentHistory';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check for both user and token
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      // Clear both if either is missing
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);
  
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Note: token is already saved in the loginUser function in api.js
  };
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  
  return (
    <Router>
      <div className="app">
        <Toaster position="top-center" />
        <Navbar user={user} handleLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails user={user} />} />
            <Route path="/login" element={<Login handleLogin={handleLogin} user={user} />} />
            <Route path="/register" element={<Register handleLogin={handleLogin} user={user} />} />
            
            {/* Auth Routes */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/resend-verification" element={<ResendVerification />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Login handleLogin={handleLogin} user={user} />} />
            <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Login handleLogin={handleLogin} user={user} />} />
            <Route path="/enrolled-courses" element={user ? <EnrolledCourses user={user} /> : <Login handleLogin={handleLogin} user={user} />} />
            <Route path="/payment-history" element={user ? <PaymentHistory user={user} /> : <Login handleLogin={handleLogin} user={user} />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
