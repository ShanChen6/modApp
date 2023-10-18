const express = require('express')
const report = require('../controllers/report');
const checkLogin = require('../middleware/middleware')
const router = express.Router()

router.get('/', report.getReports)

router.get('/:id', report.getReportDetail)

router.post('/', report.createReport)

router.delete('/:id', report.deleteReportById)

router.put('/:id', report.updateReportById)

module.exports = router
