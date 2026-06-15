const User = require('../models/User')

// @GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @GET /api/users/:id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Shaqaalaha la waayay' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Dhammaan goobaha buuxi' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email-kan horay ayaa loo isticmaalay' })
    const user = await User.create({ name, email, password, role: role || 'cashier' })
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
    if (!user) return res.status(404).json({ message: 'Shaqaalaha la waayay' })
    if (password) { user.password = password; await user.save() }
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}

// @DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Naftaada tirtiri kartid' })
    }
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'Shaqaalaha la waayay' })
    res.json({ message: 'Shaqaalaha waa la tirtiray ✅' })
  } catch (err) {
    res.status(500).json({ message: 'Cilad dhacday', error: err.message })
  }
}
