const Joi = require('joi')
const teamInfoModel = require('../models/teamInfo')
const { getItems } = require('../utils/paginate')
const _ = require('lodash')

exports.getTeamInfo = async (req, res) => {
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

        const result = await teamInfoModel.paginate({}, options)

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

exports.getTeamInfoDetail = async (req, res) => {
    try {
        const { id } = req.params
        const teamInfo = await teamInfoModel.findById(id)

        if (!teamInfo) {
            return res.status(404).json({
                status: 'fail',
                message: 'teamInfo not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            data: teamInfo,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.createTeamInfo = async (req, res) => {
    try {
        const value = await Joi.object()
            .keys({
                title: Joi.string().required(),
                content: Joi.string().required(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        await teamInfoModel.create(value)

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

exports.deleteTeamInfoById = async (req, res) => {
    try {
        const { id } = req.params
        const deleteTeamInfo = await teamInfoModel.findByIdAndDelete(id)

        if (!deleteTeamInfo) {
            return res.status(404).json({
                status: 'fail',
                message: 'teamInfo not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'teamInfo deleted successfully',
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.updateTeamInfoById = async (req, res) => {
    try {
        const { id } = req.params
        const value = await Joi.object()
            .keys({
                title: Joi.string(),
                content: Joi.string(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        const updateTeamInfo = await teamInfoModel.findOne({ _id: id })
        if (!updateTeamInfo) {
            return res.status(404).json({
                status: 'fail',
                message: 'teamInfo not found'
            })
        }

        await teamInfoModel.findByIdAndUpdate(updateTeamInfo._id, value)

        return res.status(200).json({
            status: 'success',
            data: updateTeamInfo,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}
