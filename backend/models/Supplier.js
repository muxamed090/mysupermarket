const mongoose = require('mongoose')

const supplierSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  phone:   { type: String, trim: true },
  email:   { type: String, trim: true, lowercase: true },
  address: { type: String, trim: true },
  city:    { type: String, trim: true },
  isActive:{ type: Boolean, default: true },
  notes:   { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Supplier', supplierSchema)
