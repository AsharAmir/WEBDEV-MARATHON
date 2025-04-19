const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { 
  getMyEnrollments, 
  createPaymentIntent, 
  completeEnrollment 
} = require('../controller/enrollmentController');

// Get enrollments for current user
router.get('/my-enrollments', auth, getMyEnrollments);

// Create Stripe payment intent
router.post('/create-payment-intent', auth, createPaymentIntent);

// Create enrollment after successful payment
router.post('/complete-enrollment', auth, completeEnrollment);

module.exports = router; 