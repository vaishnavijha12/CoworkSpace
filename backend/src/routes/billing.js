const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserInvoices,
  generateInvoice,
  getInvoiceById,
  payInvoice,
  getBillingSummary,
} = require('../controllers/billingController');

// @desc    Get user's invoices
// @route   GET /api/billing/invoices
// @access  Private
router.get('/invoices', protect, getUserInvoices);

// @desc    Generate invoice from bookings
// @route   POST /api/billing/generate
// @access  Private
router.post('/generate', protect, generateInvoice);

// @desc    Get invoice by ID
// @route   GET /api/billing/invoices/:id
// @access  Private
router.get('/invoices/:id', protect, getInvoiceById);

// @desc    Pay invoice
// @route   PUT /api/billing/invoices/:id/pay
// @access  Private
router.put('/invoices/:id/pay', protect, payInvoice);

// @desc    Get billing summary
// @route   GET /api/billing/summary
// @access  Private
router.get('/summary', protect, getBillingSummary);

module.exports = router;
