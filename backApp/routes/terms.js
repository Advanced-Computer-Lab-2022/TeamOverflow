var express = require('express');
var router = express.Router();
const Terms = require("../models/Terms");
const mongoose = require("mongoose");

router.get('/', async function (req, res) {
    try {
        var terms = await Terms.findOne({});
        res.status(200).json(terms)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

module.exports = router;