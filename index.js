var express = require('express'); 

var methodOverride = require('method-override'); 
var recipeAPIRoutes = require('./routes/recipe'); 
var ingredientAPIRoutes = require('./routes/ingredient');
var recipeRoutes = require('./routes/ui/recipe'); 
var ingredientRoutes = require('./routes/ui/ingredient'); 
const authRoute = require('./routes/auth')
const middleware = require('./middleware.js'); 
const query = require('./executeQuery.js'); 
var cors = require('cors'); 
var app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(cors());
app.use((req,res, next)=>{
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "*"); 
    next(); 
})



app.use(methodOverride("_method"));
app.use(express.static('public')); 

var client = require('./databaseConnect'); 

app.use('/recipe', recipeRoutes); 

//app.use('/ingredient', ingredientRoutes); 

app.use("/api/recipe", recipeAPIRoutes);

app.use("/api/ingredient", ingredientAPIRoutes);

app.use('/api/auth', authRoute)

app.get('/', function(req, res){
   res.render("home");
    

})

app.get('/home/', async function(req, res){
    try{
        var queryString = `select recipe.row_id , recipe.name , recipe.type , recipe.procedure , recipe.url, 
        json_agg(json_build_object(
		'ingredientId', ingredient.row_id , 
		'recipeIngredientId' , recipe_ingredients.row_id , 
        'ingredientName', ingredient.name)) ingredients
        from recipe 
        left outer join recipe_ingredients on
        (recipe.row_id::text  = recipe_ingredients.recipe_id)
        left outer join ingredient on 
        (recipe_ingredients.ingredient_id = ingredient.row_id :: text) 
        group by recipe.row_id , recipe.name , recipe.type , recipe.procedure , recipe.url` 
        ; 
        
   // var params = [req.params.id]; 
   var params = ""; 
     var queryResult = await query(queryString, params); 
    res.send(queryResult);
    }
    catch(error){
        res.send("Error: " + error);
    }
     
 })





app.listen(process.env.PORT || 4000, function (err){
    console.log('server started on port 4000');

})

