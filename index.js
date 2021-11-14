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

app.get('/home/:id', middleware.verify, async function(req, res){
    try{
        var queryString = "Select * from recipe where row_id = $1"; 
        
    var params = [req.params.id]; 
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

