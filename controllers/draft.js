const Joi = require('joi')
const draftsModel = require('../models/draft')
const { getItems } = require('../utils/paginate')
const _ = require('lodash')

exports.getDrafts = async (req, res) => {
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

        const result = await draftsModel.paginate({}, options)

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

exports.getDraftDetail = async (req, res) => {
    try {
        const { id } = req.params
        const drafts = await draftsModel.findById(id)

        if (!drafts) {
            return res.status(404).json({
                status: 'fail',
                message: 'Draft article not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            data: drafts,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.createDraft = async (req, res) => {
    try {
        const value = await Joi.object()
            .keys({
                linkCHPlay: Joi.string().allow(''),
                appName: Joi.string().required(),
                categoryName: Joi.string().required(),
                developer: Joi.string().required(),
                rating: Joi.number().default(5),
                icon: Joi.string().required(),
                bannerImg: Joi.string().allow(''),
                screenshots: Joi.array().items(Joi.string()),
            })
            .validateAsync(req.body, { stripUnknown: true })

        await draftsModel.create(value)

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

exports.deleteDraftById = async (req, res) => {
    try {
        const { id } = req.params
        const deleteDraft = await draftsModel.findByIdAndDelete(id)

        if (!deleteDraft) {
            return res.status(404).json({
                status: 'fail',
                message: 'News not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Draft deleted successfully',
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.updateDraftById = async (req, res) => {
    try {
        const { id } = req.params
        const value = await Joi.object()
            .keys({
                linkCHPlay: Joi.string(),
                appName: Joi.string(),
                categoryName: Joi.string(),
                developer: Joi.string(),
                rating: Joi.number(),
                icon: Joi.string(),
                bannerImg: Joi.string(),
                screenshots: Joi.array().items(Joi.string()),
            })
            .validateAsync(req.body, { stripUnknown: true })

        const updateDraft = await draftsModel.findOne({ _id: id })
        if (!updateDraft) {
            return res.status(404).json({
                status: 'fail',
                message: 'draft not found'
            })
        }

        await draftsModel.findByIdAndUpdate(updateDraft._id, value)

        return res.status(200).json({
            status: 'success',
            data: updateDraft,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}
