const Joi = require('joi')
const contactModel = require('../models/contact')
const { getItems } = require('../utils/paginate')
const _ = require('lodash')

exports.getContacts = async (req, res) => {
    try {
        const { page, page_size } = await Joi.object()
            .keys({
                page: Joi.string().default(1),
                page_size: Joi.string().default(5),
            })
            .validateAsync(req.query, { stripUnknown: true })

        const options = {
            page: page,
            limit: page_size,
        }

        const result = await contactModel.paginate({}, options)

        return res.status(200).json({
            status: 'success',
            data: result.docs,
            totalDocs: result.totalDocs,
            currentPage: result.page,
            totalPages: result.totalPages,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.getContactDetail = async (req, res) => {
    try {
        const { id } = req.params
        const contact = await contactModel.findById(id)

        if (!contact) {
            return res.status(404).json({
                status: 'fail',
                message: 'contact not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            data: contact,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.createContact = async (req, res) => {
    try {
        const value = await Joi.object()
            .keys({
                title: Joi.string().required(),
                content: Joi.string().required(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        await contactModel.create(value)

        return res.status(200).json({
            status: 'success',
            data: value,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.deleteContactById = async (req, res) => {
    try {
        const { id } = req.params
        const deleteContact = await contactModel.findByIdAndDelete(id)

        if (!deleteContact) {
            return res.status(404).json({
                status: 'fail',
                message: 'contact not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'contact deleted successfully',
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.updateContactById = async (req, res) => {
    try {
        const { id } = req.params
        const value = await Joi.object()
            .keys({
                title: Joi.string(),
                content: Joi.string(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        const updateContact = await contactModel.findOne({ _id: id })
        if (!updateContact) {
            return res.status(404).json({
                status: 'fail',
                message: 'contact not found'
            })
        }

        await contactModel.findByIdAndUpdate(updateContact._id, value)

        return res.status(200).json({
            status: 'success',
            data: updateContact,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}
