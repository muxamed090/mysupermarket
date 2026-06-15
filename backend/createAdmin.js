const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('./models/User')

dotenv.config()

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    const exists = await User.findOne({
      email: 'admin@supermarket.so'
    })

    if (exists) {
      console.log('✅ Admin hore ayuu u jiraa')
      process.exit()
    }

    await User.create({
      name: 'Admin',
      email: 'admin@supermarket.so',
      password: 'admin123',
      role: 'admin'
    })

    console.log('✅ Admin waa la abuuray')
    console.log('Email: admin@supermarket.so')
    console.log('Password: admin123')

    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

createAdmin()