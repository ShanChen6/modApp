const express = require('express')
const modApp = require('../controllers/modApp')
const checkLogin = require('../middleware/middleware')
const router = express.Router()

router.get('/', modApp.getModApps)

// router.get('/search', modApp.searchModItems)

router.get('/:slug', modApp.getModAppDetail)

// router.post('/', checkLogin.verifyToken, modApp.createModApp)
router.post('/', modApp.createModApp)

router.delete('/:id', modApp.deleteModAppById)

router.put('/:id', modApp.updateModAppById)

module.exports = router
