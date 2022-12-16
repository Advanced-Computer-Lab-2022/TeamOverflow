var express = require('express');
const Course = require('../models/Course');
const Trainee = require('../models/Trainee');
var crypto = require('crypto');
const axios = require('axios');
const { forexCode } = require('./currencyController');
const moment = require("moment")

async function processPayment(req, res, course, user) {
    try {
        if (course) {
            const input = process.env.merchantCode + req.body.merchantRefNum + req.reqId + "CARD" + course.price.toFixed(2) + req.body.cardNumber + req.body.cardExpiryYear + req.body.cardExpiryMonth + req.body.cvv + req.body.returnUrl + process.env.secureKey
            const hash = crypto.createHash('sha256').update(input).digest('hex');
            const discountRate = (course.deadline && moment().isBefore(course.deadline)) ? ((100-course.discount)/100) : 1
            const coursePrice = course.price * discountRate
            const paymentData = {
                "merchantCode": process.env.merchantCode,
                "customerName": req.body.nameOnCard,
                "customerMobile": req.body.mobile,
                "customerEmail": req.body.email,
                "customerProfileId": req.reqId,
                "cardNumber": req.body.cardNumber,
                "cardExpiryYear": req.body.cardExpiryYear,
                "cardExpiryMonth": req.body.cardExpiryMonth,
                "cvv": req.body.cvv,
                "merchantRefNum": req.body.merchantRefNum,
                "amount": await forexCode(coursePrice, req.body.currencyCode),
                "currencyCode": req.body.currencyCode,
                "language": "en-gb",
                "chargeItems": [
                    {
                        "itemId": course._id,
                        "description": course.title,
                        "price": await forexCode(coursePrice, req.body.currencyCode),
                        "quantity": "1"
                    }
                ],
                "enable3DS": true,
                "authCaptureModePayment": false,
                "returnUrl": req.body.returnUrl,
                "signature": hash,
                "paymentMethod": "CARD",
                "description": "Course Registration Payment"
            }
            const paymentRes = await axios.post("https://atfawry.fawrystaging.com/ECommerceWeb/Fawry/payments/charge", paymentData).then(response => {
                return response.data
            }).catch(error => {
                res.status(400).json({ message: error })
            })

            return paymentRes
        } else {
            res.status(404).json({ message: "Course not found" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = { processPayment }