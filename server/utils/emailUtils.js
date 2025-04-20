import nodemailer from 'nodemailer';

// Create a transporter object using the default SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send verification email
export const sendVerificationEmail = async (email, name, verificationUrl) => {
  try {
    const transporter = createTransporter();
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Virtual Training Academy" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - Virtual Training Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #0069b4;">Virtual Training Academy</h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333;">Verify Your Email</h2>
            <p>Hello ${name},</p>
            <p>Thank you for registering with Virtual Training Academy. To complete your registration, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #0069b4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, you can also click on the link below or copy and paste it into your browser:</p>
            <p><a href="${verificationUrl}">${verificationUrl}</a></p>
            
            <p>This link will expire in 24 hours.</p>
          </div>
          
          <div style="border-top: 1px solid #ddd; padding-top: 20px; color: #777; font-size: 12px;">
            <p>If you did not create an account, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} Virtual Training Academy. All rights reserved.</p>
          </div>
        </div>
      `
    });
    
    console.log('Verification email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  try {
    const transporter = createTransporter();
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Virtual Training Academy" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset - Virtual Training Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #0069b4;">Virtual Training Academy</h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p>Hello ${name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #0069b4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
            </div>
            
            <p>If the button doesn't work, you can also click on the link below or copy and paste it into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          
          <div style="border-top: 1px solid #ddd; padding-top: 20px; color: #777; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Virtual Training Academy. All rights reserved.</p>
          </div>
        </div>
      `
    });
    
    console.log('Password reset email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}; 