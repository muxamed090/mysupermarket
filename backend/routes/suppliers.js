const express = require('express')
const router = express.Router()
const { getSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController')
const { protect, managerOrAdmin } = require('../middleware/auth')

router.use(protect)

router.get('/',       getSuppliers)
router.get('/:id',    getSupplier)
router.post('/',      managerOrAdmin, createSupplier)
router.put('/:id',    managerOrAdmin, updateSupplier)
router.delete('/:id', managerOrAdmin, deleteSupplier)

module.exports = router
