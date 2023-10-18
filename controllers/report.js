const Joi = require('joi')
const reportModel = require('../models/report')
const { getItems } = require('../utils/paginate')
const _ = require('lodash')

exports.getReports = async (req, res) => {
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

        const result = await reportModel.paginate({}, options)

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

exports.getReportDetail = async (req, res) => {
    try {
        const { id } = req.params
        const report = await reportModel.findById(id)

        if (!report) {
            return res.status(404).json({
                status: 'fail',
                message: 'report not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            data: report,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.createReport = async (req, res) => {
    try {
        const value = await Joi.object()
            .keys({
                title: Joi.string().required(),
                modApp: Joi.string().required(),
                feedback: Joi.string().required(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        value.status = 'Not Viewed';

        await reportModel.create(value)

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

exports.deleteReportById = async (req, res) => {
    try {
        const { id } = req.params
        const deleteReport = await reportModel.findByIdAndDelete(id)

        if (!deleteReport) {
            return res.status(404).json({
                status: 'fail',
                message: 'report not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'report deleted successfully',
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.updateReportById = async (req, res) => {
    try {
        const { id } = req.params
        const value = await Joi.object()
            .keys({
                status: Joi.string().valid('Viewed', 'Not Viewed').required(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        const updateReport = await reportModel.findOne({ _id: id })
        if (!updateReport) {
            return res.status(404).json({
                status: 'fail',
                message: 'report not found'
            })
        }

        await reportModel.findByIdAndUpdate(updateReport._id, value)

        return res.status(200).json({
            status: 'success',
            data: updateReport,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}