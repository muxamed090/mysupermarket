const express = require('express')
const router = express.Router()
const {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, updateStock
} = require('../controllers/productController')
const { protect, managerOrAdmin } = require('../middleware/auth')

router.use(protect)

router.get('/',              getProducts)
router.get('/:id',           getProduct)
router.post('/',             managerOrAdmin, createProduct)
router.put('/:id',           managerOrAdmin, updateProduct)
router.delete('/:id',        managerOrAdmin, deleteProduct)
router.put('/:id/stock',     managerOrAdmin, updateStock)

module.exports = router
