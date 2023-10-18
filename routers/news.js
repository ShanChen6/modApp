const express = require('express')
const News = require('../controllers/news')
const checkLogin = require('../middleware/middleware')
const router = express.Router()

router.get('/', News.getNew)

router.get('/:slug', News.getNewDetail)

router.post('/', News.createNew)
// router.post('/', checkLogin.verifyToken, News.createNew)

router.delete('/:id', News.deleteNewById)
// router.delete('/:id', checkLogin.verifyToken, News.deleteNewById)

router.patch('/:id', News.updateNewById)
// router.patch('/:id', checkLogin.verifyToken, News.updateNewById)

module.exports = router
