const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const uri = process.env.MONGODB_URI
console.log('Mongo URI:', uri)

async function createAdmin() {
  try {
    await mongoose.connect(uri)
    console.log('✅ MongoDB waa la xidday')

    const User = require('./models/User')

    const exists = await User.findOne({ email: 'admin@supermarket.so' })
    if (exists) {
      console.log('⚠️  Admin horay ayuu u jiray:', exists.email)
      process.exit(0)
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@supermarket.so',
      password: 'admin123',
      role: 'admin',
      isActive: true
    })

    console.log('✅ Admin waa la abuuray!')
    console.log('   Email:   ', admin.email)
    console.log('   Password: admin123')
    console.log('   Role:    ', admin.role)
    process.exit(0)
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  }
}

createAdmin()