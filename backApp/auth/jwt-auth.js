const jwt = require("jsonwebtoken");

function verifyAdmin (req,res,next) {
    const header = req.headers['x-access-token']?.split(' ')
    const role = header[0]
    const token = header[1]
    if(role == "Admin" && token){
        jwt.verify(token, process.env.PASSPORTSECRET, (decoded, err) => {
            if(err){
                return res.json({message: "Failed to authenticate", isValid: false})
            }
            req.isValid = true
            next()
        })
    } else {
        res.json({message: "Incorrect Token", isValid: false})
    }
}

module.exports = {verifyAdmin}