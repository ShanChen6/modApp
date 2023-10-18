const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const versionModAppSchema = new mongoose.Schema(
    {
        modAppId: { type: mongoose.Schema.Types.ObjectId, ref: 'modApps', required: true },
        versionNumber: { type: String, required: true },
        fileUrl: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

versionModAppSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('versions', versionModAppSchema)
