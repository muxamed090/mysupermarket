const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`✅ MongoDB waxa ku xidhan: ${conn.connection.host}`)
  } catch (err) {
    console.error(`❌ MongoDB xiriirka waa ku guuldareystay: ${err.message}`)
    process.exit(1)
  }
}

module.exports = connectDB