const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let query = {};
    if (date) {
      query.date = date;
    } else if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    const orders = await Order.find(query).sort({ date: 1, createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/summary?date=YYYY-MM-DD
router.get('/summary', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const orders = await Order.find({ date });
    
    let totalRevenue = 0;
    let totalMorningCrates = 0;
    let totalEveningCrates = 0;
    let morningOrdersCount = 0;
    let eveningOrdersCount = 0;

    orders.forEach(order => {
      totalRevenue += order.totalAmount;
      
      let hasMorning = false;
      let hasEvening = false;

      order.products.forEach(p => {
        if (p.morningQty > 0) {
          totalMorningCrates += p.morningQty;
          hasMorning = true;
        }
        if (p.eveningQty > 0) {
          totalEveningCrates += p.eveningQty;
          hasEvening = true;
        }
      });

      if (hasMorning) morningOrdersCount++;
      if (hasEvening) eveningOrdersCount++;
    });

    // Provide a summary of the weekly trends for the chart
    // Find unique dates from orders to make a small weekly stats array
    const weeklyData = await Order.aggregate([
      {
        $group: {
          _id: '$date',
          morningQty: {
            $sum: {
              $sum: '$products.morningQty'
            }
          },
          eveningQty: {
            $sum: {
              $sum: '$products.eveningQty'
            }
          },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]);

    res.json({
      date,
      totalOrders: orders.length,
      morningOrders: morningOrdersCount,
      eveningOrders: eveningOrdersCount,
      totalMorningCrates,
      totalEveningCrates,
      revenue: parseFloat(totalRevenue.toFixed(2)),
      weeklyTrends: weeklyData.map(item => ({
        date: item._id,
        morning: item.morningQty,
        evening: item.eveningQty,
        revenue: item.revenue
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { date, retailerName, products, morningPONumber, eveningPONumber, shift, status } = req.body;
    
    // Calculate totalAmount
    const totalAmount = products.reduce((sum, p) => {
      return sum + ((p.morningQty || 0) * p.rate) + ((p.eveningQty || 0) * p.rate);
    }, 0);

    const newOrder = new Order({
      date,
      retailerName,
      products,
      morningPONumber,
      eveningPONumber,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      shift,
      status
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/orders/:id
router.put('/:id', async (req, res) => {
  try {
    const { date, retailerName, products, morningPONumber, eveningPONumber, shift, status } = req.body;
    
    // Calculate totalAmount if products are provided
    let totalAmount = 0;
    if (products) {
      totalAmount = products.reduce((sum, p) => {
        return sum + ((p.morningQty || 0) * p.rate) + ((p.eveningQty || 0) * p.rate);
      }, 0);
    }

    const updateData = { date, retailerName, products, morningPONumber, eveningPONumber, shift, status };
    if (products) {
      updateData.totalAmount = parseFloat(totalAmount.toFixed(2));
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
