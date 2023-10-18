const Joi = require('joi')
const categoryModel = require('../models/category')
const { getItems } = require('../utils/paginate')
const _ = require('lodash')

exports.getCategories = async (req, res) => {
    try {
        const { page, page_size, type } = await Joi.object()
            .keys({
                page: Joi.string().default(1),
                page_size: Joi.string().default(5),
                type: Joi.string().valid('apps', 'games'),
            })
            .validateAsync(req.query, { stripUnknown: true })

        const options = {
            page,
            limit: page_size,
        }

        let query = {}

        if (type) {
            query = { type }
        }

        const result = await categoryModel.paginate(query, options)

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

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const { page, page_size } = await Joi.object()
            .keys({
                page: Joi.number().integer().default(1),
                page_size: Joi.number().integer().default(5),
            })
            .validateAsync(req.query, { stripUnknown: true })

        const category = await categoryModel.findById(id)

        if (!category) {
            return res.status(404).json({
                status: 'fail',
                message: 'Category not found',
            })
        }

        const options = {
            page,
            limit: page_size,
        }

        const result = await categoryModel.paginate({}, options)

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

exports.createCategory = async (req, res) => {
    try {
        const value = await Joi.object()
            .keys({
                type: Joi.string().required(),
                name: Joi.string().required(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        const existingCategory = await categoryModel.findOne({ name: value.name });
        if (!existingCategory) {
            return res.status(400).json({
                status: 'fail',
                message: 'Category with this name already exists',
            });
        }

        await categoryModel.create({
            type: value.type,
            name: value.name.toLowerCase(),
        });

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

exports.deleteCategoryById = async (req, res) => {
    try {
        const { id } = req.params

        const category = await categoryModel.findById(id)

        if (!category) {
            return res.status(404).json({
                status: 'fail',
                message: 'Category not found',
            })
        }

        await category.deleteOne({ id })

        return res.status(200).json({
            status: 'success',
            message: 'Category deleted',
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.updateCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const value = await Joi.object()
            .keys({
                type: Joi.string(),
                name: Joi.string(),
            })
            .validateAsync(req.body, { stripUnknown: true });

        const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).json({
                status: 'fail',
                message: 'Category not found'
            });
        }

        if (value.name) {
            value.name = value.name.toLowerCase();
        }

        await categoryModel.findByIdAndUpdate(id, value);

        return res.status(200).json({
            status: 'success',
            data: category,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        });
    }
};