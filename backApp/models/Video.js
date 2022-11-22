const mongoose = require('mongoose');

var VideoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    url: {type: String, required: true},
}, {timestamp: true});

var Video = mongoose.model("Video",VideoSchema);
module.exports = Video;