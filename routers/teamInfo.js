const express = require('express')
const teamInfo = require('../controllers/teamInfo');
const checkLogin = require('../middleware/middleware')
const router = express.Router()

router.get('/', teamInfo.getTeamInfo)

router.get('/:id', teamInfo.getTeamInfoDetail)

router.post('/', teamInfo.createTeamInfo)

router.delete('/:id', teamInfo.deleteTeamInfoById)

router.put('/:id', teamInfo.updateTeamInfoById)

module.exports = router
