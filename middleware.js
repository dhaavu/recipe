
   
const jwt = require('jsonwebtoken')
const tokenSecret = "my-siebel"

exports.verify = (req, res, next) => {
    const token = req.headers.authorization
    console.log('token >>>' +token); 
    if (!token) res.status(403).json({error: "please provide a token"})
    else {
        jwt.verify(token, tokenSecret, (err, value) => {
            console.log("value: " + value); 
            console.log("error " + err)
            if (err) res.status(500).json({error: 'failed to authenticate token' + err})
            req.user = value.data
            next()
        })
    }
}