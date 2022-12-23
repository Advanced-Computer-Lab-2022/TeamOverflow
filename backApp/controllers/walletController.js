var express = require('express');
const Wallet = require('../models/Wallet');
const Contract = require('../models/Contract');
const axios = require('axios');
const { forexBack, forex, getCode } = require('./currencyController');
const moment = require("moment");


async function addAmountOwed(walletId, rawAmount, currency) {
    const contract = await Contract.findOne({})
    const wallet = await Wallet.findById(walletId)
    const amount = await forexBack(rawAmount, currency)
    const subTotal = amount * ((100 - contract.percentageTaken) / 100)
    wallet.$inc("balance", subTotal)
    await wallet.save()
}

async function getWallet(req, res) {
    try {
        var result = await Wallet.findById(req.user.walletId)
        var finalResult = result.toJSON()
        finalResult.balance = await forex(result.balance, req.user.country);
        finalResult.currency = getCode(req.user.country)
        res.status(200).json(finalResult)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = { addAmountOwed, getWallet }