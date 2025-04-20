import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding data'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample courses data
const coursesData = [
  {
    title: 'Complete Web Development Bootcamp',
    description: 'Learn web development from scratch. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js, and MongoDB to build full-stack applications.',
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop',
    instructor: 'Sarah Johnson',
    price: 1299,
    duration: '12 weeks',
    level: 'Beginner',
    topics: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
    rating: 4.7,
    enrollmentCount: 3254,
    featured: true
  },
  {
    title: 'Advanced React & Redux Masterclass',
    description: 'Take your React skills to the next level with advanced patterns, hooks, context API, and Redux for state management in complex applications.',
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop',
    instructor: 'Michael Chen',
    price: 999,
    duration: '8 weeks',
    level: 'Advanced',
    topics: ['React', 'Redux', 'Context API', 'Hooks', 'Testing', 'Performance Optimization'],
    rating: 4.8,
    enrollmentCount: 1876,
    featured: true
  },
  {
    title: 'Python for Data Science & Machine Learning',
    description: 'Master Python for data analysis, visualization, and machine learning. Learn NumPy, Pandas, Matplotlib, Scikit-Learn, and TensorFlow.',
    image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=800&auto=format&fit=crop',
    instructor: 'David Wilson',
    price: 1499,
    duration: '10 weeks',
    level: 'Intermediate',
    topics: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Scikit-Learn', 'TensorFlow'],
    rating: 4.9,
    enrollmentCount: 2192,
    featured: true
  },
  {
    title: 'UI/UX Design Principles',
    description: 'Learn modern UI/UX design principles and create stunning user interfaces with Figma. Master wireframing, prototyping, and user testing.',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop',
    instructor: 'Emily Rodriguez',
    price: 899,
    duration: '6 weeks',
    level: 'Beginner',
    topics: ['UI Design', 'UX Design', 'Figma', 'Wireframing', 'Prototyping', 'User Testing'],
    rating: 4.6,
    enrollmentCount: 1543,
    featured: false
  },
  {
    title: 'Mobile App Development with Flutter',
    description: 'Build beautiful, natively compiled apps for iOS and Android from a single codebase using Flutter and Dart.',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop',
    instructor: 'Alex Patel',
    price: 1199,
    duration: '9 weeks',
    level: 'Intermediate',
    topics: ['Flutter', 'Dart', 'Mobile Development', 'iOS', 'Android', 'UI Design'],
    rating: 4.7,
    enrollmentCount: 1287,
    featured: false
  },
  {
    title: 'DevOps Engineering & CI/CD Pipelines',
    description: 'Master DevOps practices including containerization, continuous integration, continuous deployment, and infrastructure as code.',
    image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop',
    instructor: 'James Miller',
    price: 1399,
    duration: '8 weeks',
    level: 'Advanced',
    topics: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform', 'Git'],
    rating: 4.8,
    enrollmentCount: 945,
    featured: false
  }
];

// Sample admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Course.deleteMany({});
    console.log('Courses collection cleared');
    
    // Add courses
    const courses = await Course.insertMany(coursesData);
    console.log(`${courses.length} courses added successfully`);
    
    // Check if admin user exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (!existingAdmin) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      // Create admin user
      const newAdmin = await User.create({
        ...adminUser,
        password: hashedPassword
      });
      
      console.log(`Admin user created: ${newAdmin.email}`);
    } else {
      console.log('Admin user already exists');
    }
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 