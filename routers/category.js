const express = require('express')
const Category = require('../controllers/category')
const router = express.Router()
const checkLogin = require('../middleware/middleware')

/* Get category route */
router.get('/', Category.getCategories)

router.get('/:id', Category.getCategoryById)

router.post('/', Category.createCategory)
// router.post('/', checkLogin.verifyToken, Category.createCategory)

router.delete('/:id', Category.deleteCategoryById)
// router.delete('/:id', checkLogin.verifyToken, Category.deleteCategoryById)

router.put('/:id', Category.updateCategoryById)
// router.put('/:id', checkLogin.verifyToken, Category.updateCategoryById)

module.exports = router
