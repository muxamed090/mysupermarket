const Category = require('../models/Category')
const Product = require('../models/Product')

// @GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body
    if (!name) return res.status(400).json({ message: 'Magaca nooca geli' })
    const exists = await Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' } })
    if (exists) return res.status(400).json({ message: 'Noocdan horay ayaa jira' })
    const category = await Category.create({ name, description, icon })
    res.status(201).json(category)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!category) return res.status(404).json({ message: 'Nooca la waayay' })
    res.json(category)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const count = await Product.countDocuments({ category: req.params.id, isActive: true })
    if (count > 0) return res.status(400).json({ message: `${count} badeecad ayaa noocadan isticmaalaya` })
    await Category.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ message: 'Nooca waa la tirtiray ✅' })
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}
