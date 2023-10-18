const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const modAppSchema = new mongoose.Schema(
    {
        // category: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true },
        category: { type: String, required: true },
        type: { type: String, enum: ['apps', 'games'], required: true },
        bannerUrl: { type: String },
        thumbnail: { type: String },
        title: { type: String, required: true },
        sortDescription: { type: String, required: true },
        appName: { type: String, required: true },
        publisher: { type: String, required: true },
        genre: { type: String, required: true },
        size: { type: String, required: true },
        latestVersion: { type: String, required: true },
        modInfo: { type: String, default: '' },
        description: { type: String, required: true },
        screenshots: [{ type: String }],
        slug: { type: String, unique: true, required: true },
        viewCount: { type: Number, default: 0 },
        linkCHPlay: { type: String, default: '' },
    },
    {
        timestamps: true,
    }
)

modAppSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('modApps', modAppSchema)
