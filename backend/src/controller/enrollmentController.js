const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { stripe } = require('../config/stripe');
const mongoose = require('mongoose');

// Get enrollments for current user
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user._id })
      .populate('courseId')
      .sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrollments', error: error.message });
  }
};

// Create Stripe payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Validate course ID
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    
    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Get course details
    const course = await Course.findById(courseId).lean();
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Validate course price
    if (!course.price || course.price <= 0) {
      return res.status(400).json({ message: 'Invalid course price' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price * 100), // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        courseId: course._id.toString(),
        userId: req.user._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      course: {
        _id: course._id,
        title: course.title,
        price: course.price
      }
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ 
      message: 'Error creating payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Create enrollment after successful payment
const completeEnrollment = async (req, res) => {
  try {
    const { courseId, paymentIntentId } = req.body;

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      studentId: req.user._id,
      courseId,
      paymentId: paymentIntentId,
      amount: paymentIntent.amount / 100,
      status: 'active'
    });

    await enrollment.save();

    // Update course total students
    await Course.findByIdAndUpdate(
      courseId,
      { $inc: { totalStudents: 1 } }
    );

    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Error completing enrollment', error: error.message });
  }
};

module.exports = {
  getMyEnrollments,
  createPaymentIntent,
  completeEnrollment
}; 