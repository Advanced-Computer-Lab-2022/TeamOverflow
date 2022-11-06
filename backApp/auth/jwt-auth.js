const jwt = require("jsonwebtoken");

function verifyAdmin (req,res,next) {
    const header = req.headers['x-access-token']?.split(' ')
    const role = header[0]
    const token = header[1]
    if(role == "Admin" && token){
        jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
            console.log(err)
            if(err){
                return res.json({message: err, isValid: false})
            }
            req.reqId = decoded._id
            next()
        })
    } else {
        res.json({message: "Incorrect Token", isValid: false})
    }
}

function verifyInstructor (req,res,next) {
    const header = req.headers['x-access-token']?.split(' ')
    const role = header[0]
    const token = header[1]
    if(role == "Instructor" && token){
        jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
            if(err){
                return res.json({message: "Failed to authenticate", isValid: false})
            }
            req.reqId = decoded._id
            next()
        })
    } else {
        res.json({message: "Incorrect Token", isValid: false})
    }
}

function verifyTrainee (req,res,next) {
    const header = req.headers['x-access-token']?.split(' ')
    const role = header[0]
    const token = header[1]
    if(role == "Trainee" && token){
        jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
            if(err){
                return res.json({message: "Failed to authenticate", isValid: false})
            }
            req.reqId = decoded._id
            next()
        })
    } else {
        res.json({message: "Incorrect Token", isValid: false})
    }
}

function verifyCorpTrainee (req,res,next) {
    const header = req.headers['x-access-token']?.split(' ')
    const role = header[0]
    const token = header[1]
    if(role == "Corporate" && token){
        jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
            if(err){
                return res.json({message: "Failed to authenticate", isValid: false})
            }
            req.reqId = decoded._id
            next()
        })
    } else {
        res.json({message: "Incorrect Token", isValid: false})
    }
}

function verifyAllUsers (req,res,next) {
    const header = req.headers['x-access-token']?.split(' ')
    const role = header[0]
    const token = header[1]
    if((role == "Instructor" || role == "Trainee") && token){
        jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
            if(err){
                return res.json({message: "Failed to authenticate", isValid: false})
            }
            req.reqId = decoded._id
            next()
        })
    } else if(role == "Guest"){
        next()
    } else {
        res.json({message: "Incorrect Token", isValid: false})
    }
}

function verifyAllUsersCorp (req,res,next) {
    const header = req.headers['x-access-token']?.split(' ')
    const role = header[0]
    const token = header[1]
    if((role == "Instructor" || role == "Trainee" || role == "Corporate") && token){
        jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
            if(err){
                return res.json({message: "Failed to authenticate", isValid: false})
            }
            req.reqId = decoded._id
            next()
        })
    } else if(role == "Guest"){
        next()
    } else {
        res.json({message: "Incorrect Token", isValid: false})
    }
}

module.exports = {verifyAdmin, verifyInstructor, verifyAllUsers, verifyAllUsersCorp, verifyTrainee, verifyCorpTrainee}