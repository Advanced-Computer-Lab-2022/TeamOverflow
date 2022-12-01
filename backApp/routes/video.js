var express = require('express');
var router = express.Router();
const Video = require("../models/Video");
const mongoose = require("mongoose");

router.get('/', async function (req, res) {
    try {
        var video = await Video.findById(req.query.videoId);
        res.status(200).json(video)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

module.exports = router;