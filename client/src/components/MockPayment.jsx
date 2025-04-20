import { useState } from 'react';
import { verifyPayment } from '../utils/api';
import toast from 'react-hot-toast';

const MockPayment = ({ order, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [expiryDate, setExpiryDate] = useState('12/25');
  const [cvv, setCvv] = useState('123');
  const [name, setName] = useState('Test User');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create mock payment and signature IDs
      const razorpayPaymentId = 'pay_' + Math.random().toString(36).substring(2, 15);
      const razorpaySignature = Math.random().toString(36).substring(2, 30);

      // Send verification request
      const response = await verifyPayment({
        razorpayOrderId: order.id,
        razorpayPaymentId,
        razorpaySignature,
        paymentId: order.paymentId
      });

      setLoading(false);
      
      if (response.success) {
        toast.success('Payment successful!');
        onSuccess && onSuccess();
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="mock-payment-overlay">
      <div className="mock-payment-modal">
        <div className="mock-payment-header">
          <h3>Complete Your Payment</h3>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>
        
        <div className="mock-payment-body">
          <div className="order-details">
            <div className="order-amount">Amount: ₹{order.amount/100}</div>
            <div className="order-id">Order ID: {order.id}</div>
          </div>
          
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label>Card Number</label>
              <input 
                type="text" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card Number"
                className="form-control"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input 
                  type="text" 
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>CVV</label>
                <input 
                  type="text" 
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="CVV"
                  className="form-control"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Name on Card</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name on card"
                className="form-control"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary payment-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
          
          <div className="mock-payment-footer">
            <p>This is a mock payment. No real transaction will occur.</p>
            <div className="secure-badge">
              <i className="fas fa-lock"></i> Secure Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPayment; 