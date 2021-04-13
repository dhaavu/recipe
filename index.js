var express = require('express'); 
var bodyParser = require('body-parser'); 
var methodOverride = require('method-override'); 
var recipeAPIRoutes = require('./routes/recipe'); 
var ingredientAPIRoutes = require('./routes/ingredient');
var recipeRoutes = require('./routes/ui/recipe'); 
var ingredientRoutes = require('./routes/ui/ingredient'); 
var cors = require('cors'); 
var app = express();
app.set('view engine', 'ejs');
app.use(cors());

app.use((req,res, next)=>{
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "*"); 
    next(); 
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static('public')); 

var client = require('./databaseConnect'); 

app.use('/recipe', recipeRoutes); 

//app.use('/ingredient', ingredientRoutes); 

app.use("/api/recipe", recipeAPIRoutes);

app.use("/api/ingredient", ingredientAPIRoutes);


app.get('/', function(req, res){

    res.render("home");

})


app.listen(process.env.PORT || 4000, function (err){
    console.log('server started on port 4000');

})

