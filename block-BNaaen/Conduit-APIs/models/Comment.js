var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    title: {type: String, required: true},
    body: {type: String},
    author: {type: Schema.Types.ObjectId, ref:"User"},
    article: {type: Schema.Types.ObjectId, ref:"Article"},
}, {timestamps: true})

module.exports = mongoose.model('Comment', commentSchema);