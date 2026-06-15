const express = require('express')
const router = express.Router()
const { getSales, getSale, createSale, refundSale } = require('../controllers/saleController')
const { protect, managerOrAdmin } = require('../middleware/auth')

router.use(protect)

router.get('/',             getSales)
router.get('/:id',          getSale)
router.post('/',            createSale)
router.put('/:id/refund',   managerOrAdmin, refundSale)

module.exports = router
