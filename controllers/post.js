const mongoose = require('mongoose')
const Joi = require('joi')
const { transValidation } = require('../langs/errors/vn')
const postModel = require('../models/post')
const { getItems } = require('../utils/paginate')
const _ = require('lodash')

exports.getPosts = async (req, res) => {
    try {
        const { page, page_size, type, categoryId, keyword } =
            await Joi.object()
                .keys({
                    page: Joi.string().default(1),
                    page_size: Joi.string().default(5),
                    type: Joi.string(),
                    categoryId: Joi.string(),
                    keyword: Joi.string().min(2),
                })
                .validateAsync(req.query, { stripUnknown: true })
        const options = {
            populate: ['categoryId'],
            categoryId,
            type,
            keyword,
        }

        const result = await getItems(postModel, page, page_size, options)

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

exports.createPost = async (req, res) => {
    try {
        const value = await Joi.object()
            .keys({
                title: Joi.string().required(),
                image: Joi.string(),
                content: Joi.string().required(),
                slug: Joi.string().required(),
                user_name: Joi.string(),
                view_count: Joi.number(),
                categoryId: Joi.string(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        const slug = await postModel.findOne({ slug: value.slug })
        if (slug) {
            return res.status(400).json({
                status: 'fail',
                message: transValidation.slug_exist,
            })
        }

        await postModel.create(value)

        return res.status(200).json({
            status: 'success',
            message: transValidation.input_correct,
            data: value,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.getPostDetail = async (req, res) => {
    try {
        const { id } = req.params
        const post = await postModel
            .findOne({ slug: id })
            .populate('categoryId')
        if (_.isEmpty(post)) {
            return res.status(401).json({
                status: 'fail',
                message: transValidation.not_found,
            })
        }

        await postModel.findByIdAndUpdate(post._id, {
            view_count: post.view_count + 1,
        })

        return res.status(200).json({
            status: 'success',
            data: post,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await postModel.findById(id)
        if (!post) {
            return res.status(401).json({
                status: 'fail',
                message: transValidation.not_found,
            })
        }

        await postModel.findByIdAndDelete(id)

        return res.status(200).json({
            status: 'success',
            message: transValidation.input_correct,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}
exports.editPost = async (req, res) => {
    const { id } = req.params
    try {
        const value = await Joi.object()
            .keys({
                title: Joi.string(),
                image: Joi.string(),
                content: Joi.string(),
                slug: Joi.string(),
            })
            .validateAsync(req.body, { stripUnknown: true })
        const post = await postModel.findOne({ slug: id })
        if (!post) {
            return res.status(401).json({
                status: 'fail',
                message: transValidation.not_found,
            })
        }
        await postModel.findByIdAndUpdate(post._id, value)

        return res.status(200).json({
            status: 'success',
            message: transValidation.input_correct,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}
