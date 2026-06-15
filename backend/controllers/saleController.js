const Sale = require('../models/Sale')
const Product = require('../models/Product')

// @GET /api/sales
exports.getSales = async (req, res) => {
  try {
    const { date, startDate, endDate, page = 1, limit = 50 } = req.query
    const filter = {}

    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0)
      const end   = new Date(date); end.setHours(23, 59, 59, 999)
      filter.createdAt = { $gte: start, $lte: end }
    } else if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }

    const sales = await Sale.find(filter)
      .populate('cashier', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit)

    res.json(sales)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @GET /api/sales/:id
exports.getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('cashier', 'name')
    if (!sale) return res.status(404).json({ message: 'Iibka la waayay' })
    res.json(sale)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @POST /api/sales
exports.createSale = async (req, res) => {
  try {
    const { items, paymentMethod, customerName, customerPhone, discount, notes } = req.body
    if (!items || !items.length) return res.status(400).json({ message: 'Waxba kuma jiraan iibka' })

    // Xaqiiji badeecadaha oo ka jar kaydka
    const saleItems = []
    let totalAmount = 0

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) return res.status(404).json({ message: `Badeecadda ${item.product} la waayay` })
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name}: kaydka kama filna (${product.stock} kaliya)` })
      }
      const subtotal = product.price * item.quantity
      totalAmount += subtotal
      saleItems.push({ product: product._id, name: product.name, quantity: item.quantity, price: product.price, subtotal })
      product.stock -= item.quantity
      await product.save()
    }

    const sale = await Sale.create({
      items: saleItems,
      totalAmount,
      discount: discount || 0,
      finalAmount: totalAmount - (discount || 0),
      paymentMethod: paymentMethod || 'cash',
      customerName,
      customerPhone,
      cashier: req.user._id,
      notes,
    })

    res.status(201).json(sale)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @PUT /api/sales/:id/refund
exports.refundSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
    if (!sale) return res.status(404).json({ message: 'Iibka la waayay' })
    if (sale.status === 'refunded') return res.status(400).json({ message: 'Iibkan horay waa loo soo celiyay' })

    // Soo celi kaydka
    for (const item of sale.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    }

    sale.status = 'refunded'
    await sale.save()
    res.json({ message: 'Iibka waa la soo celiyay ✅', sale })
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}
