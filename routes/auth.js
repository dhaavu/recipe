const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const rounds = 10
var pool = require('../databaseConnect'); 
const jwt = require('jsonwebtoken')
const tokenSecret = "my-siebel"

const middleware = require('../middleware.js')

router.post('/login', async (req, res)=> {
    var queryString = 'select  * from users where email= $1'; 
    //console.log(req); 
    var client; 
    try{
         client = await pool.connect(); 
        var queryResult = await client.query(queryString,[req.body.email] ); 
        var compare = await bcrypt.compare(req.body.password, queryResult.rows[0].hash)
        //console.log(compare); 
        if(compare)
        res.status(200).json({token: generateToken(queryResult.rows[0])})
        else 
        res.status(403).json({error: 'passwords do not match'})
    }
    
    catch(error){
        console.log("Error generating token / loggin in ---- > ")
        res.status(500).json(error)
    }
    finally {
        client.release()
      }
    
})

router.post('/signup', async (req,res)=> {
    try{
        const client = await pool.connect(); 
        var hash = await bcrypt.hash(req.body.password, rounds); 
        console.log("hash" + hash); 
        var queryString = 'insert into users (email, hash) values ($1 , $2)'
        var queryResult = await client.query(queryString, [req.body.email, hash])
        console.log('success: '  )
        res.status(200).json({token: generateToken(queryResult.rows[0])})

    }
    catch(err){
        console.log("error hashing -- " + err ); 
        res.status(500).json(err); 
    }
    finally {
        client.release()
      }

})
// router.post('/signup', (req, res) => {
//     console.log(JSON.stringify(req.body)); 
//     bcrypt.hash(req.body.password, rounds, (error, hash) => {
//         if (error) res.status(500).json(error)
//         else {
//             console.log("hash" + hash); 
//             var queryString = 'insert into users (email, hash) values ($1 , $2)'
//             client.query(queryString, [req.body.email, hash], function(err, user){
//                 if(err){
//                     res.status(500).json(error)
//                     console.log("error : " + err )
//                 }
//                 else 
//                 {
//                     console.log('success: '  )
//                     res.status(200).json({token: generateToken(user)})
//                 }
                
//             })

            
//         }
//     })
// });

router.get('/jwt-test', middleware.verify , (req, res) => {
    res.status(200).json(req.user)
})

function generateToken(user){
    return jwt.sign({data: user}, tokenSecret, {expiresIn: '24h'})
}

module.exports = router