const express = require('express')
const CrawlService = require('../services/crawl.service')
const router = express.Router()

/* Get Crawl route */
router.get('/', CrawlService.crawlApp)


module.exports = router
