const express = require('express')
const contact = require('../controllers/contact');
const checkLogin = require('../middleware/middleware')
const router = express.Router()

router.get('/', contact.getContacts)

router.get('/:id', contact.getContactDetail)

router.post('/', contact.createContact)

router.delete('/:id', contact.deleteContactById)

router.put('/:id', contact.updateContactById)

module.exports = router
