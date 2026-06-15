const Supplier = require('../models/Supplier')

// @GET /api/suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ isActive: true }).sort({ name: 1 })
    res.json(suppliers)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @GET /api/suppliers/:id
exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
    if (!supplier) return res.status(404).json({ message: 'Keenaha la waayay' })
    res.json(supplier)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @POST /api/suppliers
exports.createSupplier = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ message: 'Magaca keenaha geli' })
    const supplier = await Supplier.create(req.body)
    res.status(201).json(supplier)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @PUT /api/suppliers/:id
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!supplier) return res.status(404).json({ message: 'Keenaha la waayay' })
    res.json(supplier)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @DELETE /api/suppliers/:id
exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ message: 'Keenaha waa la tirtiray ✅' })
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}
