const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth',       require('./routes/auth'))
app.use('/api/products',   require('./routes/products'))
app.use('/api/sales',      require('./routes/sales'))
app.use('/api/reports',    require('./routes/reports'))
app.use('/api/users',      require('./routes/users'))
app.use('/api/categories', require('./routes/categories'))
app.use('/api/suppliers',  require('./routes/suppliers'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'MySupermarket API waa shaqeynaysaa ✅' }))

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Waddo la waayay' }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Cilad server-ka ah', error: process.env.NODE_ENV === 'development' ? err.message : undefined })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server wuxuu ku shaqeynayaa port ${PORT}`))
