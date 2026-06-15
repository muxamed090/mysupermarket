const Sale = require('../models/Sale')
const Product = require('../models/Product')
const User = require('../models/User')

// @GET /api/reports/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)

    const [todaySales, totalProducts, lowStockCount] = await Promise.all([
      Sale.find({ createdAt: { $gte: today, $lt: tomorrow }, status: 'completed' }),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true, $expr: { $lte: ['$stock', '$minStock'] } }),
    ])

    const revenue = todaySales.reduce((sum, s) => sum + s.finalAmount, 0)

    // Chart: iibka 7 maalmood
    const chartData = []
    const days = ['Axad', 'Isniin', 'Talaado', 'Arbaco', 'Khamis', 'Jimce', 'Sabti']
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0)
      const nextD = new Date(d); nextD.setDate(nextD.getDate() + 1)
      const daySales = await Sale.find({ createdAt: { $gte: d, $lt: nextD }, status: 'completed' })
      chartData.push({ name: days[d.getDay()], iib: daySales.reduce((s, x) => s + x.finalAmount, 0) })
    }

    res.json({
      stats: { revenue, products: totalProducts, sales: todaySales.length, lowStock: lowStockCount },
      chartData,
    })
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @GET /api/reports
exports.getReports = async (req, res) => {
  try {
    const { period = 'weekly' } = req.query
    const now = new Date()
    let startDate = new Date()
    if (period === 'weekly')  startDate.setDate(now.getDate() - 7)
    if (period === 'monthly') startDate.setMonth(now.getMonth() - 1)
    if (period === 'yearly')  startDate.setFullYear(now.getFullYear() - 1)

    const sales = await Sale.find({ createdAt: { $gte: startDate }, status: 'completed' })
    const totalRevenue = sales.reduce((s, x) => s + x.finalAmount, 0)
    const avgSale = sales.length ? Math.round(totalRevenue / sales.length) : 0

    // Iibka maalinta
    const salesByDayMap = {}
    const dayNames = ['Axad', 'Isniin', 'Talaado', 'Arbaco', 'Khamis', 'Jimce', 'Sabti']
    sales.forEach(s => {
      const key = dayNames[new Date(s.createdAt).getDay()]
      salesByDayMap[key] = (salesByDayMap[key] || 0) + s.finalAmount
    })
    const salesByDay = dayNames.map(d => ({ day: d.slice(0, 3), total: salesByDayMap[d] || 0 }))

    // Badeecadaha ugu badan
    const productSales = {}
    sales.forEach(s => s.items.forEach(item => {
      productSales[item.name] = (productSales[item.name] || 0) + item.quantity
    }))
    const topProducts = Object.entries(productSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)

    // Qaabka lacag bixinta
    const paymentMap = { cash: 0, card: 0, mobile: 0 }
    sales.forEach(s => { paymentMap[s.paymentMethod] = (paymentMap[s.paymentMethod] || 0) + 1 })
    const total = sales.length || 1
    const paymentBreakdown = [
      { name: 'Lacag Caddaan', value: Math.round((paymentMap.cash / total) * 100) },
      { name: 'Kaarka',        value: Math.round((paymentMap.card / total) * 100) },
      { name: 'Lacag Guursi', value: Math.round((paymentMap.mobile / total) * 100) },
    ]

    res.json({
      salesByDay,
      topProducts,
      paymentBreakdown,
      summary: { totalRevenue, totalSales: sales.length, avgSale, topCategory: 'Cuntada Aasaasiga' },
    })
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}
