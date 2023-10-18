const Joi = require('joi')
const newModel = require('../models/news')
const { getItems } = require('../utils/paginate')
const _ = require('lodash')
const slugify = require('slugify')

exports.getNew = async (req, res) => {
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

        const result = await newModel.paginate({}, options)

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

exports.getNewDetail = async (req, res) => {
    try {
        const { slug } = req.params
        const news = await newModel.findOne({ slug })

        if (!news) {
            return res.status(404).json({
                status: 'fail',
                message: 'News article not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            data: news,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.createNew = async (req, res) => {
    try {
        const value = await Joi.object()
            .keys({
                title: Joi.string().required(),
                images: Joi.string().allow(''),
                content: Joi.string().required(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        let slug = slugify(value.title, { lower: true })

        const existingPost = await newModel.findOne({ slug })
        if (existingPost) {
            let isSlugUnique = false
            let counter = 1

            while (!isSlugUnique) {
                const newSlug = `${slug}-${counter}`
                const newExistingPost = await newModel.findOne({
                    slug: newSlug,
                })

                if (!newExistingPost) {
                    isSlugUnique = true
                    slug = newSlug
                } else {
                    counter++
                }
            }
        }

        value.slug = slug

        await newModel.create(value)

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

exports.deleteNewById = async (req, res) => {
    try {
        const { id } = req.params
        const deletedNews = await newModel.findByIdAndDelete(id)

        if (!deletedNews) {
            return res.status(404).json({
                status: 'fail',
                message: 'News not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'News deleted successfully',
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.updateNewById = async (req, res) => {
    try {
        const { id } = req.params
        const value = await Joi.object()
            .keys({
                title: Joi.string(),
                images: Joi.string(),
                content: Joi.string(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        const updateNews = await newModel.findOne({ _id: id })
        if (!updateNews) {
            return res.status(404).json({
                status: 'fail',
                message: 'news not found'
            })
        }

        await newModel.findByIdAndUpdate(updateNews._id, value)

        return res.status(200).json({
            status: 'success',
            data: updateNews,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}
