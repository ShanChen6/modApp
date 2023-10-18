const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const contactSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

contactSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('contacts', contactSchema)
