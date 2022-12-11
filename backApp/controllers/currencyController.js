const express = require("express");
var router = express.Router();
const axios = require("axios");
const moment = require("moment");
var exchange
var currencies = require("country-json/src/country-by-currency-code.json")

async function forex(amount, country) {
    var curr = currencies.filter((elem) => elem.country === country)[0]?.currency_code
    await updateRates()
    var rate = exchange.rates[curr] || exchange.rates.USD
    return (amount * rate).toFixed(2)
}

async function forexCode(amount, code) {
    await updateRates()
    var rate = exchange.rates[code] || exchange.rates.USD
    return (amount * rate).toFixed(2)
}

//API call to update exchange rates
async function updateRates() {
    if (!exchange || moment(exchange.lastUpdate).add(1, "day").isBefore(moment())) {
        var ex = await axios.get("https://v6.exchangerate-api.com/v6/76b74834bd41f9920042f73c/latest/USD")
        exchange = { lastUpdate: ex.data.time_last_update_utc, rates: ex.data.conversion_rates }
        console.log(`Exchange rates updated: ${exchange.lastUpdate}`)
    }
}

module.exports = { updateRates, forex, forexCode }