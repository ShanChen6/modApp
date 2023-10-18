const Joi = require('joi')
const requestModel = require('../models/request')
const { getItems } = require('../utils/paginate')
const _ = require('lodash')

exports.getRequests = async (req, res) => {
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

        const result = await requestModel.paginate({}, options)

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

exports.getRequestDetail = async (req, res) => {
    try {
        const { id } = req.params
        const request = await requestModel.findById(id)

        if (!request) {
            return res.status(404).json({
                status: 'fail',
                message: 'request not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            data: request,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.createRequest = async (req, res) => {
    try {
        const value = await Joi.object()
            .keys({
                title: Joi.string().required(),
                modApp: Joi.string().required(),
                linkCHPlay: Joi.string().required(),
                modFeatures: Joi.string().allow(''),
            })
            .validateAsync(req.body, { stripUnknown: true })

        value.status = 'Not Viewed';

        await requestModel.create(value)

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

exports.deleteRequestById = async (req, res) => {
    try {
        const { id } = req.params
        const deleteRequest = await requestModel.findByIdAndDelete(id)

        if (!deleteRequest) {
            return res.status(404).json({
                status: 'fail',
                message: 'request not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'request deleted successfully',
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.updateRequestById = async (req, res) => {
    try {
        const { id } = req.params
        const value = await Joi.object()
            .keys({
                status: Joi.string().valid('Viewed', 'Not Viewed').required(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        const updateRequest = await requestModel.findOne({ _id: id })
        if (!updateRequest) {
            return res.status(404).json({
                status: 'fail',
                message: 'request not found'
            })
        }

        await requestModel.findByIdAndUpdate(updateRequest._id, value)

        return res.status(200).json({
            status: 'success',
            data: updateRequest,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}