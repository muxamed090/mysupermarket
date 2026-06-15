const express = require('express')
const router = express.Router()
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { protect, managerOrAdmin } = require('../middleware/auth')

router.use(protect)

router.get('/',       getCategories)
router.post('/',      managerOrAdmin, createCategory)
router.put('/:id',    managerOrAdmin, updateCategory)
router.delete('/:id', managerOrAdmin, deleteCategory)

module.exports = router
