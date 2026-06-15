const Product = require('../models/Product')

// @GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { search, category, lowStock, page = 1, limit = 100 } = req.query
    const filter = { isActive: true }
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { barcode: search }]
    if (category) filter.category = category
    if (lowStock === 'true') filter.$expr = { $lte: ['$stock', '$minStock'] }

    const products = await Product.find(filter)
      .populate('category', 'name icon')
      .populate('supplier', 'name')
      .sort({ name: 1 })
      .limit(Number(limit))
      .skip((page - 1) * limit)

    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @GET /api/products/:id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category supplier')
    if (!product) return res.status(404).json({ message: 'Badeecadda la waayay' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body

    // Xaqiiji required fields
    if (!name || name.trim() === '') return res.status(400).json({ message: 'Magaca badeecadda waa waajib' })
    if (price === undefined || price === '') return res.status(400).json({ message: 'Qiimaha waa waajib' })
    if (stock === undefined || stock === '') return res.status(400).json({ message: 'Kaydka waa waajib' })

    // Nadiifi xogta
    const data = {
      ...req.body,
      name:  name.trim(),
      price: Number(price),
      stock: Number(stock),
    }
    // Tirso goobaha madhan ee ObjectId ah
    if (!data.category) delete data.category
    if (!data.supplier) delete data.supplier
    if (!data.barcode)  delete data.barcode

    const product = await Product.create(data)
    await product.populate('category supplier')
    res.status(201).json(product)
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Barcode-kan horay ayaa loo isticmaalay' })
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map(e => e.message).join(', ')
      return res.status(400).json({ message: msg })
    }
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('category supplier')
    if (!product) return res.status(404).json({ message: 'Badeecadda la waayay' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!product) return res.status(404).json({ message: 'Badeecadda la waayay' })
    res.json({ message: 'Badeecadda waa la tirtiray ✅' })
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @PUT /api/products/:id/stock
exports.updateStock = async (req, res) => {
  try {
    const { quantity, type } = req.body // type: 'add' | 'subtract' | 'set'
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Badeecadda la waayay' })
    if (type === 'add') product.stock += Number(quantity)
    else if (type === 'subtract') product.stock = Math.max(0, product.stock - Number(quantity))
    else product.stock = Number(quantity)
    await product.save()
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}