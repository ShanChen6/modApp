const express = require('express')
const request = require('../controllers/request');
const checkLogin = require('../middleware/middleware')
const router = express.Router()

router.get('/', request.getRequests)

router.get('/:id', request.getRequestDetail)

router.post('/', request.createRequest)

router.delete('/:id', request.deleteRequestById)

router.put('/:id', request.updateRequestById)

module.exports = router
