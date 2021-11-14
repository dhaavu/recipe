const express = require("express"); 
var router = express.Router(); 
var pool = require('../databaseConnect'); 

    router.get('/', async function(req, res){
    var response = {}; 

    var queryString= `select * from ingredient`; 
    const client = await pool.connect(); 
    try{
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
    }
    finally{
        client.release(); 
    }
   
  
    })
    
    
    router.get('/:id', async function(req, res){
        
        queryString=   `select * from ingredient where row_id = $1`; 
        var response = {}; 
        const client = await pool.connect(); 
        try{
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
        }
        finally{
            client.release(); 
        }
        
        }); 
    
    router.post('/new', async function (req, res){
    var queryString = `insert into ingredient (name)
    values 
    ($1) RETURNING row_id`; 

    var response={}; 
    const client = await pool.connect(); 
    try{
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
    }    
    finally{
        client.release(); 
    } 
    
    })
    
    router.post('/:id', async function (req, res){
        var response = {}; 
        var queryString = `update ingredient set name = $1 where row_id = $2 returning row_id`; 
        const client = await pool.connect(); 
        try{
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
        }
        finally{
            client.release(); 
        }
        
    
    }); 
    
    router.delete('/:id', async function (req, res){
        var response = {}; 
        var queryString = `delete from ingredient where row_id = $1 returning row_id`; 
        const client = await pool.connect(); 
        try{
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
        }
        finally{
            client.release(); 
        }
       
    
    }); 

module.exports = router; 