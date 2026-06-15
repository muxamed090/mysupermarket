const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) return res.status(401).json({ message: 'Oggolaanshaha ma jiro, fadlan gal' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) return res.status(401).json({ message: 'Isticmaalaha la waayay' })
    if (req.user.isActive === false) return res.status(401).json({ message: 'Akoonkaaga waa la joojiyey' })
    next()
  } catch {
    res.status(401).json({ message: 'Token-ka waa khaldan yahay' })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Fursaddan admin kaliya ayaa leh' })
  }
  next()
}

const managerOrAdmin = (req, res, next) => {
  if (!['admin', 'manager'].includes(req.user?.role)) {
    return res.status(403).json({ message: 'Fursaddan admin ama maareeyaha ayaa leh' })
  }
  next()
}

module.exports = { protect, adminOnly, managerOrAdmin }
