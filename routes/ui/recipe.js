const express = require("express"); 
const router = express.Router(); 
const axios = require("axios"); 


router.get('/', function(req, res){
    axios.get('http://localhost:4000/api/recipe')
    .then (function(response){
       
        if(response.data.msg='success'){

        res.render('recipe', {recipe: response.data.recipe});
        }
        else 
        res.render('error', {error: response.data.msg});  
    }).catch(function(error){
    
        res.render('error', {error: error}); 
    })
}); 

module.exports = router; 
