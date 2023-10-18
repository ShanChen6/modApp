const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const CommentSchema = new mongoose.Schema(
    {
        modAppId: { type: mongoose.Schema.Types.ObjectId, ref: 'modApps', required: true },
        content: { type: String, required: true },
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

CommentSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('comments', CommentSchema)
