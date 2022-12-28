var express = require('express');
const Wallet = require('../models/Wallet');
const Contract = require('../models/Contract');
const axios = require('axios');
const { forexBack, forex, getCode } = require('./currencyController');
const moment = require("moment");
const Invoice = require('../models/Invoice');


async function addAmountOwed(reqId, course, rawAmount) {
    const contract = await Contract.findOne({})
    const wallet = await Wallet.findById(course.instructorId.walletId)
    const subTotal = rawAmount * ((100 - contract.percentageTaken) / 100)
    await Invoice.create({
        instructorId: course.instructorId._id,
        traineeId: reqId,
        courseId: course._id,
        balance: subTotal.toFixed(2)
    })
    wallet.$inc("balance", subTotal.toFixed(2))
    await wallet.save()
}

async function transfer(instructor, trainee, courseId, amount) {
    const contract = await Contract.findOne({})
    const deduct = amount * ((100 - contract.percentageTaken) / 100) * -1
    const instructorWallet = await Wallet.findById(instructor.walletId)
    const traineeWallet = await Wallet.findById(trainee.walletId)
    await Invoice.create({
        instructorId: instructor._id,
        traineeId: trainee._id,
        courseId: courseId,
        balance: deduct
    })
    instructorWallet.$inc("balance", deduct)
    traineeWallet.$inc("balance", amount)
    await instructorWallet.save()
    await traineeWallet.save()
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

module.exports = { addAmountOwed, getWallet, transfer }