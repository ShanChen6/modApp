const express = require('express')
const seoModApp = require('../controllers/titleSeo')
const checkLogin = require('../middleware/middleware')
const router = express.Router()

router.get('/', seoModApp.getSeo)

router.get('/:id', seoModApp.getSeoDetail)

router.post('/', seoModApp.createSeo)

router.delete('/:id', seoModApp.deleteSeoById)

router.put('/:id', seoModApp.updateSeoById)

module.exports = router
