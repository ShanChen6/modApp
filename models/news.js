const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const newSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        images: { type: String },
        content: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    }
)

newSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('news', newSchema)
