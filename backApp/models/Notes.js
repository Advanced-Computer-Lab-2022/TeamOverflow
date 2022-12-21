const mongoose = require('mongoose');

var NotesSchema = new mongoose.Schema({
    traineeId : {type: mongoose.Types.ObjectId, required: true},
    videoId : {type:mongoose.Types.ObjectId, ref:"Video", required: true },
    content: {type: String, required: true},
    timestamp: {type: Number, required: true},
}, {timestamp: true});

var Notes = mongoose.model("Notes",NotesSchema);
module.exports = Notes;