const express = require("express"); 
var router = express.Router(); 
var client = require('../databaseConnect'); 

router.get('/', function(req, res){
var response = {}; 
var queryStr= `select * from recipe`; 
//console.log(queryStr); 
client.query(queryStr, function(err, resp)  {
    if(err){
        console.log('Error getting the recipes: ' + err); 
        response.msg = 'Error getting the recipes: ' + err; 
        res.send(response); 
    }
    else {
        response.msg='success'; 
        response.recipe = resp.rows; 
        res.send(response);
    }
    
})
})


router.get('/:id', function(req, res){
    var response = {}; 
    queryString=   `select recipe.name, recipe.row_id, recipe.url, recipe.procedure, 
    json_agg(json_build_object(
    'recipe_ingredient_id', recipe_ingredients.row_id , 
    'ingredient_id', ingredient_id,   
    'ingredient', ingredient.name, 
    'qty', recipe_ingredients.qty, 
    'measure', recipe_ingredients.measure)) ingredients 
    from recipe 
    left outer join recipe_ingredients on 
        (recipe.row_id::text  = recipe_ingredients.recipe_id)
    left outer  join ingredient on 
        (ingredient.row_id::text = recipe_ingredients.ingredient_id) where 
    recipe.row_id = $1
    group by recipe.name, recipe.row_id, recipe.url, recipe.procedure`; 

    client.query(queryString,[req.params.id],  function (err, resp) {
        if(err){
            console.log("Error getting the recipe: " + err); 
            response.msg = "Error getting the recipe: " + err; 
            res.send(response); 
        }
        else {
            response.msg = 'success'; 
            response.recipe=resp.rows[0]; 
            res.send(response); 
        }
    })
    }); 

router.post('/new', function (req, res){
    var response = {}; 

    var queryString = `insert into recipe (name, type, procedure)
    values 
    ($1, $2, $3) RETURNING row_id`; 

    client.query(queryString, [ req.body.name, req.body.type, req.body.procedure], function(err, result){
        if(err){
            console.log('Error creating recipe: ' + err); 
            response.msg = 'Error creating recipe: ' + err; 
            res.send(response); 
        }
        else {
            response.msg='success';
            response.recipe = result.rows;  
            res.send(response);
        }   
    })
})

router.post('/:id', function (req, res){
    var response = {}; 
    var queryString = `update recipe set name = $1, type=$2 , procedure=$3 where row_id = $4 returning row_id`; 
    client.query(queryString, [req.body.name, req.body.type, req.body.procedure, req.params.id], function(err, result){
        if(err){
            console.log('Error creating recipe: ' + err);
            response.msg = 'Error creating recipe: ' + err; 
            res.send(response); 
        }             
        else {
            response.msg="success"; 
            response.recipe = result.rows; 
            res.send(response);
        }   
    })

}); 

router.delete('/:id', function (req, res){
    var response = {}; 
    var queryString = `delete from recipe where row_id = $1 returning row_id`; 
    client.query(queryString, [req.params.id], function(err, result){
        if(err){
            console.log('Error deleting recipe: ' + err); 
            response.msg = 'Error deleting recipe: ' + err; 
            res.send(response); 
        }
        else {
            queryString = `delete from recipe_ingredients where recipe_id = $1`; 
            client.query(queryString, [req.params.id], function (error, resp){
                if(error){
                    console.log("error deleting the recipe ingredients: " + error); 
                    response.msg = "error deleting the recipe ingredients: " + error; 
                    res.send(response); 
                }
                else { 
                    response.msg = 'success'; 
                    response.recipe = result.rows; 
                    response.recipe_ingredients = res.rows; 
                    res.send(response); 
                }
            }) 
            res.send(result.rows);
        }   
    }); 

});

router.post('/ingredient/new', function(req, res){
    var response = {}; 

    var queryString = `insert into recipeingredients(recepe_id, ingredient_id, qty,measure) values ($1, $2, $3, $4)`; 
    client.query(queryString, [req.body.recipe_id, req.body.ingredient_id, req.body.qty, req.body.measure], function(err, resp){ 
        if (err){ 
            console.log('error adding recipe ingredient: ' + err);
            response.msg = 'error adding recipe ingredient: ' + err; 
            res.send(response);  
        }
        else {
            response.msg = 'success'; 
            response.recipe_ingredient = resp.rows; 
            res.send(response); 
        }
    })
})

router.post('/ingredient/:id', function(req, res){
    var response = {}; 

    var queryString = `update recipe_ingredients set ingredent_id = $2 qty = $3, measure = $4 where row_id = $1`; 
    client.query(queryString, [req.params.id,req.body.ingredient_id, req.body.qty, req.body.measure], function(err, resp){ 
        if (err){ 
            console.log('error updating recipe ingredient: ' + err);
            response.msg = 'error updating recipe ingredient: ' + err; 
            res.send(response);  
        }
        else {
            response.msg = 'success'; 
            response.recipe_ingredient = resp.rows; 
            res.send(response); 
        }
    })
}); 

router.delete('/ingredient/:id', function(req, res){
    var response = {}; 

    var queryString = `delete from recipe_ingredients where row_id = $1`; 
    client.query(queryString, [req.params.id], function(err, resp){ 
        if (err){ 
            console.log('error deleting recipe ingredient: ' + err);
            response.msg = 'error deleting recipe ingredient: ' + err; 
            res.send(response);  
        }
        else {
            response.msg = 'success'; 
            response.recipe_ingredient = resp.rows; 
            res.send(response); 
        }
    })
})

module.exports = router; 