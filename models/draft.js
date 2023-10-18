const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const draftSchema = new mongoose.Schema(
    {
        linkCHPlay: { type: String, default: '' },
        appName: { type: String, required: true },
        categoryName: { type: String, required: true },
        developer: { type: String, required: true },
        rating: { type: Number, required: true },
        icon: { type: String, required: true },
        bannerImg: { type: String, default: null },
        screenshots: [{ type: String }],
    },
    {
        timestamps: true,
    }
)

draftSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('drafts', draftSchema)
