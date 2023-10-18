const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const teamInfoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

teamInfoSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('teamInfo', teamInfoSchema)
