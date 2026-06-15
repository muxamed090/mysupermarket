const express = require('express')
const router = express.Router()
const { getDashboard, getReports } = require('../controllers/reportController')
const { protect, managerOrAdmin } = require('../middleware/auth')

router.use(protect)

router.get('/dashboard', getDashboard)
router.get('/',          managerOrAdmin, getReports)

module.exports = router
