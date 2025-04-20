import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPaymentHistory } from '../utils/api';
import toast from 'react-hot-toast';

const PaymentHistory = ({ user }) => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setIsLoading(true);
        const paymentData = await getPaymentHistory();
        setPayments(paymentData);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch payment history:', error);
        toast.error('Failed to load payment history. Please try again later.');
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchPaymentHistory();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) {
    return <div className="loading">Loading payment history...</div>;
  }
  
  return (
    <div className="payment-history-page">
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
              <Link to="/enrolled-courses" className="sidebar-link">
                <i className="fas fa-book"></i> My Courses
              </Link>
              <Link to="/payment-history" className="sidebar-link active">
                <i className="fas fa-history"></i> Payment History
              </Link>
              <Link to="/profile" className="sidebar-link">
                <i className="fas fa-user"></i> Profile Settings
              </Link>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="dashboard-content">
            <h2 className="dashboard-title">Payment History</h2>
            
            {payments.length === 0 ? (
              <div className="no-payments">
                <p>You don't have any payment records yet.</p>
                <Link to="/courses" className="btn btn-primary">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="payment-table-container">
                <table className="payment-table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment._id}>
                        <td className="course-info">
                          <img 
                            src={payment.course.image} 
                            alt={payment.course.title} 
                            className="course-thumbnail" 
                          />
                          <div className="course-name">
                            <Link to={`/courses/${payment.course._id}`}>
                              {payment.course.title}
                            </Link>
                          </div>
                        </td>
                        <td className="amount">₹{payment.amount}</td>
                        <td className="date">{formatDate(payment.createdAt)}</td>
                        <td className={`status ${payment.status}`}>
                          <span className="status-badge">{payment.status}</span>
                        </td>
                        <td className="transaction-id">
                          {payment.razorpayPaymentId ? 
                            payment.razorpayPaymentId.slice(0, 10) + '...' : 
                            'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory; 