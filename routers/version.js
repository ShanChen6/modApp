const express = require('express')
const versions = require('../controllers/version')
const checkLogin = require('../middleware/middleware')
const router = express.Router()

router.get('/', versions.getVersionsForModApp)

router.post('/', versions.createSingleVersion)
// router.post('/', checkLogin.verifyToken, versions.createSingleVersion)

router.post('/create', versions.createMultipleVersions)
// router.post('/create', checkLogin.verifyToken, versions.createMultipleVersions)

router.delete('/:id', versions.deleteVersionById)
// router.delete('/:id', checkLogin.verifyToken, versions.deleteVersionById)

router.patch('/:id', versions.updateVersionById)
// router.patch('/:id', checkLogin.verifyToken, versions.updateVersionById)

module.exports = router
