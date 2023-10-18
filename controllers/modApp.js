const Joi = require('joi')
const modAppsModel = require('../models/modApp')
const categoriesModel = require('../models/category')
const versionModel = require('../models/version')
const seoModel = require('../models/titleSeo')
const { getItems } = require('../utils/paginate')
const _ = require('lodash')
const slugify = require('slugify');

exports.getModApps = async (req, res) => {
    try {
        const { page, page_size, category, type, keyword } =
            await Joi.object()
                .keys({
                    page: Joi.string().default(1),
                    page_size: Joi.string().default(15),
                    type: Joi.string().valid('apps', 'games'),
                    keyword: Joi.string().min(2),
                    category: Joi.string(),
                })
                .validateAsync(req.query, { stripUnknown: true })

        const options = {
            populate: ['category'],
            category: category,
            type,
            keyword,
        }

        const result = await getItems(modAppsModel, page, page_size, options)

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

exports.getModAppDetail = async (req, res) => {
    try {
        const { slug } = req.params

        const modApp = await modAppsModel.findOne({ slug })
        if (!modApp) {
            return res.status(404).json({
                status: 'fail',
                message: 'ModApp not found'
            })
        }

        const titleSeo = await seoModel.findOne({ modAppId: modApp._id });
        const versions = await versionModel.find({ modAppId: modApp._id });

        modApp.viewCount += 1;
        await modApp.save();

        const modAppDetail = {
            ...modApp._doc,
            titleSeo: titleSeo ? titleSeo.titleSeo : '',
            versions: versions ? versions.map(version => ({
                versionNumber: version.versionNumber,
                fileUrl: version.fileUrl
            })) : []
        };

        return res.status(200).json({
            status: 'success',
            data: modAppDetail,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

// exports.getModAppByCategoryId = async (req, res) => {
//     try {
//         const { category } = req.params

//         const modApps = await modAppsModel.find({ category })

//         if (!modApps) {
//             return res.status(404).json({
//                 status: 'fail',
//                 message: 'ModApp not found'
//             })
//         }
//         return res.status(200).json({
//             status: 'success',
//             data: modApps,
//         })
//     } catch (error) {
//         return res.status(400).json({
//             status: 'fail',
//             message: error.message,
//         })
//     }
// }

exports.createModApp = async (req, res) => {
    try {
        const value = await Joi.object()
            .keys({
                category: Joi.string().required(),
                type: Joi.string().valid('apps', 'games').required(),
                bannerUrl: Joi.string().allow(''),
                thumbnail: Joi.string().allow(''),
                title: Joi.string().required(),
                sortDescription: Joi.string().required(),
                appName: Joi.string().required(),
                publisher: Joi.string().required(),
                genre: Joi.string().required(),
                size: Joi.string().required(),
                latestVersion: Joi.string().required(),
                modInfo: Joi.string().allow(''),
                description: Joi.string().required(),
                screenshots: Joi.array().items(Joi.string()),
                linkCHPlay: Joi.string().allow(''),
            })
            .validateAsync(req.body, { stripUnknown: true })

        const lowerCategoryName = value.category.toLowerCase();

        let category = await categoriesModel.findOne({ name: lowerCategoryName });

        if (!category) {
            category = await categoriesModel.create({ name: lowerCategoryName, type: value.type });
        }

        let slug = slugify(value.title, { lower: true });

        const existingModApp = await modAppsModel.findOne({ slug });
        if (existingModApp) {
            let isSlugUnique = false;
            let counter = 1;

            while (!isSlugUnique) {
                const newSlug = `${slug}-${counter}`;
                const newExistingPost = await modAppsModel.findOne({ slug: newSlug });

                if (!newExistingPost) {
                    isSlugUnique = true;
                    slug = newSlug;
                } else {
                    counter++;
                }
            }
        }

        value.slug = slug;
        value.category = lowerCategoryName;

        const modApp = await modAppsModel.create(value);

        const titleSeo = {
            modAppId: modApp._id,
            titleSeo: `${modApp.appName} ${modApp.latestVersion}`
        };

        await seoModel.create(titleSeo);

        return res.status(200).json({
            status: 'success',
            data: modApp,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.deleteModAppById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteModApp = await modAppsModel.findByIdAndDelete(id);

        if (!deleteModApp) {
            return res.status(404).json({
                status: 'fail',
                message: 'ModApp not found',
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'modApp deleted successfully',
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.updateModAppById = async (req, res) => {
    try {
        const { id } = req.params
        const value = await Joi.object()
            .keys({
                category: Joi.string(),
                type: Joi.string(),
                bannerUrl: Joi.string(),
                thumbnail: Joi.string(),
                title: Joi.string(),
                sortDescription: Joi.string(),
                appName: Joi.string(),
                publisher: Joi.string(),
                genre: Joi.string(),
                size: Joi.string(),
                latestVersion: Joi.string(),
                modInfo: Joi.string(),
                description: Joi.string(),
                screenshots: Joi.array().items(Joi.string()),
                linkCHPlay: Joi.string(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        const modApp = await modAppsModel.findOne({ _id: id })
        if (!modApp) {
            return res.status(404).json({
                status: 'fail',
                message: 'modApp not found'
            })
        }

        if (value.category) {
            value.category = value.category.toLowerCase();
        }

        await modAppsModel.findByIdAndUpdate(modApp._id, value);

        return res.status(200).json({
            status: 'success',
            data: modApp,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}
