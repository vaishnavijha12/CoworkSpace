const Billing = require('../models/Billing');
const DeskBooking = require('../models/DeskBooking');
const RoomBooking = require('../models/RoomBooking');

// Get user's invoices
exports.getUserInvoices = async (req, res) => {
  try {
    const invoices = await Billing.find({ user: req.user.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    console.log(`📋 Retrieved ${invoices.length} invoices for user ${req.user.id}`);
    res.json({ success: true, invoices });
  } catch (error) {
    console.error('❌ Get user invoices error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate invoice from bookings
exports.generateInvoice = async (req, res) => {
  try {
    const { bookingIds, bookingType } = req.body;

    let bookings = [];
    const items = [];
    let subtotal = 0;

    if (bookingType === 'desk') {
      bookings = await DeskBooking.find({
        _id: { $in: bookingIds },
        user: req.user.id,
      }).populate('desk');

      bookings.forEach(booking => {
        items.push({
          description: `Desk Booking - ${booking.desk.deskNumber} (${booking.desk.location})`,
          type: 'desk-booking',
          quantity: booking.duration,
          unitPrice: booking.desk.hourlyRate,
          amount: booking.totalAmount,
          bookingRef: booking._id,
        });
        subtotal += booking.totalAmount;
      });
    } else if (bookingType === 'room') {
      bookings = await RoomBooking.find({
        _id: { $in: bookingIds },
        user: req.user.id,
      }).populate('meetingRoom');

      bookings.forEach(booking => {
        items.push({
          description: `Room Booking - ${booking.meetingRoom.name}`,
          type: 'room-booking',
          quantity: booking.duration,
          unitPrice: booking.meetingRoom.hourlyRate,
          amount: booking.totalAmount,
          bookingRef: booking._id,
        });
        subtotal += booking.totalAmount;
      });
    }

    const tax = subtotal * 0.1; // 10% tax
    const totalAmount = subtotal + tax;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days from now

    const invoice = new Billing({
      user: req.user.id,
      items,
      subtotal,
      tax,
      totalAmount,
      dueDate,
      status: 'sent',
    });

    await invoice.save();
    await invoice.populate('user', 'name email');

    console.log(`✅ Generated invoice ${invoice.invoiceNumber}`);
    res.status(201).json({ success: true, invoice });
  } catch (error) {
    console.error('❌ Generate invoice error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Billing.findById(req.params.id).populate('user', 'name email');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check if user owns the invoice or is admin
    if (invoice.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, invoice });
  } catch (error) {
    console.error('❌ Get invoice by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Pay invoice
exports.payInvoice = async (req, res) => {
  try {
    const { paymentMethod, transactionId } = req.body;
    
    const invoice = await Billing.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check if user owns the invoice
    if (invoice.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    invoice.status = 'paid';
    invoice.paymentMethod = paymentMethod;
    invoice.paymentDate = Date.now();
    invoice.transactionId = transactionId;
    
    await invoice.save();
    
    console.log(`✅ Paid invoice ${invoice.invoiceNumber}`);
    res.json({ success: true, invoice });
  } catch (error) {
    console.error('❌ Pay invoice error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get billing summary
exports.getBillingSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalSpent, pendingAmount, paidInvoices, pendingInvoices] = await Promise.all([
      Billing.aggregate([
        { $match: { user: userId, status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Billing.aggregate([
        { $match: { user: userId, status: { $in: ['sent', 'overdue'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Billing.countDocuments({ user: userId, status: 'paid' }),
      Billing.countDocuments({ user: userId, status: { $in: ['sent', 'overdue'] } }),
    ]);

    const summary = {
      totalSpent: totalSpent[0]?.total || 0,
      pendingAmount: pendingAmount[0]?.total || 0,
      paidInvoices,
      pendingInvoices,
    };

    res.json({ success: true, summary });
  } catch (error) {
    console.error('❌ Get billing summary error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
