const express = require('express')
const draft = require('../controllers/draft')
const checkLogin = require('../middleware/middleware')
const router = express.Router()

router.get('/', draft.getDrafts)

router.get('/:id', draft.getDraftDetail)

router.post('/', draft.createDraft)

router.delete('/:id', draft.deleteDraftById)

router.put('/:id', draft.updateDraftById)

module.exports = router
