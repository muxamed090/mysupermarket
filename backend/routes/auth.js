const express = require('express')
const router = express.Router()
const { login, getMe, register, changePassword } = require('../controllers/authController')
const { protect, adminOnly } = require('../middleware/auth')

router.post('/login',    login)
router.post('/register', protect, adminOnly, register)
router.get('/me',        protect, getMe)
router.put('/password',  protect, changePassword)

module.exports = router
