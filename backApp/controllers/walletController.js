var express = require('express');
const Wallet = require('../models/Wallet');
const Contract = require('../models/Contract');
const axios = require('axios');
const { forexBack } = require('./currencyController');
const moment = require("moment")

async function addAmountOwed(walletId, rawAmount, currency) {
    const contract = await Contract.findOne({})
    const wallet = await Wallet.findById(walletId)
    const amount = await forexBack(rawAmount, currency)
    const subTotal = amount * ((100 - contract.percentageTaken)/100)
    wallet.$inc("balance",subTotal)
    await wallet.save()
}

module.exports = { addAmountOwed }