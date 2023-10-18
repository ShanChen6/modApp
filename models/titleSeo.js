const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const titleSeoSchema = new mongoose.Schema(
    {
        modAppId: { type: mongoose.Schema.Types.ObjectId, ref: 'modApps', required: true },
        titleSeo: { type: String, default: '' },
    },
    {
        timestamps: true,
    }
)

titleSeoSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('seos', titleSeoSchema)
