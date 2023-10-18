const Joi = require('joi')
const commentsModel = require('../models/comment')
const modAppsModel = require('../models/modApp')
const { getItems } = require('../utils/paginate')
const _ = require('lodash')

exports.getComments = async (req, res) => {
    try {
        const { page, page_size, modAppId, status } = await Joi.object()
            .keys({
                page: Joi.string().default(1),
                page_size: Joi.string().default(5),
                modAppId: Joi.string(),
                status: Joi.string().valid('pending', 'approved'),
            })
            .validateAsync(req.query, { stripUnknown: true });

        const options = {
            modAppId,
            status,
        }

        const result = await getItems(commentsModel, page, page_size, options)

        return res.status(200).json({
            status: 'success',
            data: result.docs,
            totalDocs: result.totalDocs,
            currentPage: result.page,
            totalPages: result.totalPages,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.createComment = async (req, res) => {
    try {
        const value = await Joi.object()
            .keys({
                modAppId: Joi.string(),
                content: Joi.string().required(),
                name: Joi.string().required(),
                email: Joi.string().required(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        value.status = 'pending';

        if (value.modAppId) {
            const modAppExists = await modAppsModel.findOne({ _id: value.modAppId });
            if (!modAppExists) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'ModApp not found for the provided modAppId',
                });
            }
        }

        await commentsModel.create(value)

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

exports.deleteCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteComment = await commentsModel.findByIdAndDelete(id);

        if (!deleteComment) {
            return res.status(404).json({
                status: 'fail',
                message: 'Comment not found',
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Comment deleted successfully',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.updateCommentById = async (req, res) => {
    try {
        const { id } = req.params
        const value = await Joi.object()
            .keys({
                status: Joi.string().valid('pending', 'approved').required(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        const updateComment = await commentsModel.findOne({ _id: id })
        if (!updateComment) {
            return res.status(404).json({
                status: 'fail',
                message: 'comment not found'
            })
        }

        await commentsModel.findByIdAndUpdate(updateComment._id, value)

        return res.status(200).json({
            status: 'success',
            data: updateComment,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}