var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: {type: String, required: true, unique: true},
    slug:{type: String},
    description:{type: String},
    body: {type: String},
    tagList: [{type: String}],
    comments:[{type: Schema.Types.ObjectId, ref:'Comment'}],
    favorited:[{type: Schema.Types.ObjectId, ref:'User', unique: true}],
    favoritesCount:{type: Number, default: 0},
    author: {type: Schema.Types.ObjectId, ref:'User'}
}, {timestamps: true})

module.exports = mongoose.model('Article', articleSchema);