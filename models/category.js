const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const CategorySchema = new mongoose.Schema(
    {
        type: { type: String, enum: ['apps', 'games'], required: true },
        name: { type: String, required: true }
    },
    {
        timestamps: true,
    }
)

CategorySchema.plugin(mongoosePaginate)
module.exports = mongoose.model('categories', CategorySchema)
