const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const reportSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        modApp: { type: String, required: true },
        feedback: { type: String, required: true },
        status: { type: String, enum: ['Not Viewed', 'Viewed'], required: true },

    },
    {
        timestamps: true,
    }
)

reportSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('reports', reportSchema)
