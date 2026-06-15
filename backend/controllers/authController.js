const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

// @POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email iyo password geli' })

    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email ama password waa khaldan yahay' })
    }
    if (user.isActive === false) return res.status(401).json({ message: 'Akoonkaaga waa la joojiyey' })

    user.lastLogin = new Date()
    await user.save()

    res.json({ token: generateToken(user._id), user })
  } catch (err) {
    res.status(500).json({ message: 'Cilad server-ka ah', error: err.message })
  }
}

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json(req.user)
}

// @POST /api/auth/register (admin kaliya)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Dhammaan goobaha buuxi' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email-kan horay ayaa loo isticmaalay' })

    const user = await User.create({ name, email, password, role: role || 'cashier' })
    res.status(201).json({ token: generateToken(user._id), user })
  } catch (err) {
    res.status(500).json({ message: 'Cilad server-ka ah', error: err.message })
  }
}

// @PUT /api/auth/password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Passwordka hore waa khaldan yahay' })
    }
    user.password = newPassword
    await user.save()
    res.json({ message: 'Password waa la beddelay ✅' })
  } catch (err) {
    res.status(500).json({ message: 'Cilad server-ka ah', error: err.message })
  }
}
