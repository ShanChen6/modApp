const express = require('express')
const comment = require('../controllers/comment')
const checkLogin = require('../middleware/middleware')
const router = express.Router()

router.get('/', comment.getComments)

router.post('/', comment.createComment)

router.delete('/:id', comment.deleteCommentById)
// router.delete('/:id', checkLogin.verifyToken, comment.deleteCommentById)

router.put('/:id', comment.updateCommentById)
// router.put('/:id', checkLogin.verifyToken, comment.updateCommentById)

module.exports = router
