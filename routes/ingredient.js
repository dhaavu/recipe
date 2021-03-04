const express = require("express"); 
var router = express.Router(); 
var client = require('../databaseConnect'); 

    router.get('/', function(req, res){
    var response = {}; 

    var queryString= `select * from ingredient`; 
       client.query(queryString, (err, resp) => {
            if(err){
                response.msg= 'Error getting the ingredients!!! ' + err; 
                console.log('Error getting the ingredients!!! ' + err); 
                res.send(response); 
               
            }
            else{
                response.msg = "success"; 
            response.ingredient = resp.rows; 
            res.send(response);
            }
            
          
          })
  
    })
    
    
    router.get('/:id', function(req, res){
        
        queryString=   `select * from ingredient where row_id = $1`; 
        var response = {}; 
        client.query(queryString, [req.params.id], (err, resp) => {
          if(err){
              
              response.msg = 'error getting the ingredient!! ' +  err; 
              console.log('error getting the ingredient!! ' +  err); 
              res.send(response.msg);
   
          }
          
          response.ingredient = resp.rows; 
          response.msg = "Success"; 
          res.send(response);
        })
        }); 
    
    router.post('/new', function (req, res){
    var queryString = `insert into ingredient (name)
    values 
    ($1) RETURNING row_id`; 

    var response={}; 
            
    client.query(queryString, [req.body.name] , function(err, result){
        if(err){
            console.log('Error creating ingredient: ' + err); 
            response.msg = 'Error creating ingredient: ' + err; 
            res.send(response)
        }else {
            response.message='success'; 
            response.ingredient = result.rows; 
            res.send(response);
        }   
    })
    })
    
    router.post('/:id', function (req, res){
        var response = {}; 
        var queryString = `update ingredient set name = $1 where row_id = $2 returning row_id`; 
        client.query(queryString, [req.body.name, req.params.id], function(err, result){
            if(err){
                console.log('Error updating ingredient: ' + err); 
                response.msg = 'Error updating ingredient: ' + err; 
                res.send(response); 
            }
            else {
                response.msg = 'success'; 
                response.ingredient = result.rows; 
                res.send(response);
            }   
        })
    
    }); 
    
    router.delete('/:id', function (req, res){
        var response = {}; 
        var queryString = `delete from ingredient where row_id = $1 returning row_id`; 
        client.query(queryString, [req.params.id], function(err, result){
            if(err){
                console.log('Error deleting ingredient: ' + err); 
                response.msg = 'Error deleting ingredient: ' + err; 
                res.send(response); 
            }
            else {
                    queryString = 'delete from recipe_ingredients where ingredient_id = $1'; 
                    client.query(queryString, [req.params.id], function(error, resp){
                    if(error){
                        console.log('Error deleting recipe ingredients: ' + error); 
                        response.msg = 'Error deleting recipe ingredients: ' + error; 
                        res.send(response); 
                    }else {
                    response.msg = 'success'; 
                    response.ingredient = result.rows;  
                    response.recipe_ingredients = resp.rows;                 
                    res.send(response);
                    }
                    
                })
               
            }   
        })
    
    }); 

module.exports = router; 