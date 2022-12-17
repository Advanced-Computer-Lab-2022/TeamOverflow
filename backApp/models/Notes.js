const mongoose = require('mongoose');

var NotesSchema = new mongoose.Schema({
    studentId : {type: mongoose.Types.ObjectId, required: true},
    vidId : {type:mongoose.Types.ObjectId, required: true },
    content: {type: String, required: true},
    timestamp: {type: Number, required: true},
}, {timestamp: true});

var Notes = mongoose.model("Notes",NotesSchema);
module.exports = Notes;