const Joi = require('joi')
const modAppsModel = require('../models/modApp');
const seoModel = require('../models/titleSeo')
const { getItems } = require('../utils/paginate')
const _ = require('lodash')

exports.getSeo = async (req, res) => {
    try {
        const { page, page_size, modAppId } = await Joi.object()
            .keys({
                page: Joi.string().default(1),
                page_size: Joi.string().default(10),
                modAppId: Joi.string(),
            })
            .validateAsync(req.query, { stripUnknown: true })

        const options = {
            modAppId
        }

        const result = await getItems(seoModel, page, page_size, options)
        console.log(result)
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
};

exports.getSeoDetail = async (req, res) => {
    try {
        const { id } = req.params
        const seo = await seoModel.findById(id)

        if (!seo) {
            return res.status(404).json({
                status: 'fail',
                message: 'seo not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            data: seo,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.createSeo = async (req, res) => {
    try {
        const value = await Joi.object()
            .keys({
                modAppId: Joi.string().required(),
                titleSeo: Joi.string().allow(''),
            })
            .validateAsync(req.body, { stripUnknown: true })

        if (value.modAppId) {
            const modAppExists = await modAppsModel.findOne({ _id: value.modAppId });
            if (!modAppExists) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'ModApp not found for the provided modAppId',
                });
            }
        }

        await seoModel.create(value)

        return res.status(200).json({
            status: 'success',
            data: value,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        });
    }
};

exports.deleteSeoById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteSeo = await seoModel.findByIdAndDelete(id);

        if (!deleteSeo) {
            return res.status(404).json({
                status: 'fail',
                message: 'Seo not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Seo deleted successfully',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
};

exports.updateSeoById = async (req, res) => {
    try {
        const { id } = req.params
        const value = await Joi.object()
            .keys({
                modAppId: Joi.string(),
                title: Joi.string(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        const SeoToUpdate = await seoModel.findOne({ _id: id })
        if (!SeoToUpdate) {
            return res.status(404).json({
                status: 'fail',
                message: 'seo not found'
            })
        }

        await seoModel.findByIdAndUpdate(SeoToUpdate._id, value)

        return res.status(200).json({
            status: 'success',
            data: SeoToUpdate,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
};