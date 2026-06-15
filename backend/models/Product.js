const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  barcode:     { type: String, trim: true, sparse: true },
  price:       { type: Number, required: true, min: 0 },
  costPrice:   { type: Number, min: 0, default: 0 },
  stock:       { type: Number, required: true, min: 0, default: 0 },
  minStock:    { type: Number, default: 10 },
  unit:        { type: String, enum: ['kg', 'g', 'L', 'ml', 'piece', 'box', 'dozen'], default: 'piece' },
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  supplier:    { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  description: { type: String },
  image:       { type: String },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true })

productSchema.virtual('isLowStock').get(function () {
  return this.stock <= this.minStock
})

productSchema.virtual('profit').get(function () {
  return this.price - this.costPrice
})

module.exports = mongoose.model('Product', productSchema)
