var express = require('express');
const Course = require('../models/Course');
const Trainee = require('../models/Trainee');
var crypto = require('crypto');
const axios = require('axios');
const { forexCode } = require('./currencyController');
const moment = require("moment")
const stripe = require('stripe')(process.env.SECUREKEY);

async function verifyPayment(req, res) {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.body.session_id);
        return session.payment_status === "paid"
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function getPaymentLink(req, res, course) {
    try {
        const discountRate = (course.deadline && moment().isBefore(course.deadline)) ? ((100 - course.discount) / 100) : 1
        const coursePrice = await forexCode(course.price * discountRate, req.body.currencyCode)

        const session = await stripe.checkout.sessions.create({
            success_url: `http://localhost:3000/paymentCompleted/{CHECKOUT_SESSION_ID}/${course._id}`,
            cancel_url: `http://localhost:3000/paymentCompleted/failed/${course._id}`,
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: req.body.currencyCode.toLowerCase(),
                        product_data: {
                            name: course.title,
                            description: course.summary
                        },
                        unit_amount_decimal: coursePrice * 100
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
        });

        res.status(200).json({ paymentUrl: session.url })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = { getPaymentLink, verifyPayment }