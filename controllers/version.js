const Joi = require('joi')
const VersionModApp = require('../models/version');
const modAppsModel = require('../models/modApp');
const { getItems } = require('../utils/paginate')
const _ = require('lodash')

exports.getVersionsForModApp = async (req, res) => {
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

        const result = await getItems(VersionModApp, page, page_size, options)
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

exports.createSingleVersion = async (req, res) => {
    try {
        const value = await Joi.object()
            .keys({
                modAppId: Joi.string().required(),
                versionNumber: Joi.string().required(),
                fileUrl: Joi.string().required(),
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

        await VersionModApp.create(value)

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

exports.createMultipleVersions = async (req, res) => {
    try {
        const { modAppId, versions } = await Joi.object()
            .keys({
                modAppId: Joi.string().required(),
                versions: Joi.array()
                    .items(
                        Joi.object({
                            versionNumber: Joi.string().required(),
                            fileUrl: Joi.string().required(),
                        })
                    )
                    .min(1)
                    .required(),
            })
            .validateAsync(req.body, { stripUnknown: true });

        const modAppExists = await modAppsModel.findOne({ _id: modAppId });

        if (!modAppExists) {
            return res.status(404).json({
                status: 'fail',
                message: 'ModApp not found for the provided modAppId',
            });
        }

        const createdVersions = await VersionModApp.create(
            versions.map(version => ({ ...version, modAppId }))
        );

        return res.status(200).json({
            status: 'success',
            data: createdVersions,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
}

exports.deleteVersionById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVersion = await VersionModApp.findByIdAndDelete(id);

        if (!deletedVersion) {
            return res.status(404).json({
                status: 'fail',
                message: 'Version not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Version deleted successfully',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
};

exports.updateVersionById = async (req, res) => {
    try {
        const { id } = req.params
        const value = await Joi.object()
            .keys({
                modAppId: Joi.string(),
                versionNumber: Joi.string(),
                fileUrl: Joi.string(),
            })
            .validateAsync(req.body, { stripUnknown: true })

        const versionToUpdate = await VersionModApp.findOne({ _id: id })
        if (!versionToUpdate) {
            return res.status(404).json({
                status: 'fail',
                message: 'Version not found'
            })
        }

        await VersionModApp.findByIdAndUpdate(versionToUpdate._id, value)

        return res.status(200).json({
            status: 'success',
            data: versionToUpdate,
        })
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.message,
        })
    }
};