const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const requestSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        modApp: { type: String, required: true },
        linkCHPlay: { type: String, required: true },
        modFeature: { type: String, default: '' },
        status: { type: String, enum: ['Not Viewed', 'Viewed'], required: true },
    },
    {
        timestamps: true,
    }
)

requestSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('requests', requestSchema)
