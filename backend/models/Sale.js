const mongoose = require('mongoose')

const saleItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price:    { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true },
}, { _id: false })

const saleSchema = new mongoose.Schema({
  items:         { type: [saleItemSchema], required: true },
  totalAmount:   { type: Number, required: true, min: 0 },
  discount:      { type: Number, default: 0, min: 0 },
  finalAmount:   { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'card', 'mobile'], default: 'cash' },
  customerName:  { type: String, trim: true },
  customerPhone: { type: String, trim: true },
  cashier:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes:         { type: String },
  status:        { type: String, enum: ['completed', 'refunded', 'pending'], default: 'completed' },
}, { timestamps: true })

saleSchema.pre('save', function (next) {
  this.finalAmount = this.totalAmount - (this.discount || 0)
  next()
})

module.exports = mongoose.model('Sale', saleSchema)
