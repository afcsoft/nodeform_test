//Imports
var express = require("express");
var pg=require("pg").Pool;
var bodyParser = require('body-parser'); 
//Objects
var app = express();
//Database connection object from connection string.
const pool=new pg({host:'localhost',database:'treetest',user:'postgres',password:'postgres',port:'5432'});
//POST interface data parsing method
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 
//Server Port
const _port = process.env.PORT || 5000;
//Server Data
const _app_folder = __dirname + '/' ;
// ---- SERVE STATIC FILES ---- //
app.use(express.static(__dirname + '/' ));
app.post('*.*', express.static(_app_folder, {maxAge: '1y'}));
// ---- SERVE API --- //
//This shows Database table in json format in browser
app.get("/api/data",function(req,res)
{
    pool.query("select row_to_json(t) as DATA from (select name,latitude,longitude,height from trees) t;", (err1, res1) => 
        {   
            if(err1) {return console.log(err1);}
            res.send(res1.rows)        
        });         
});
//This saves data to database
app.post('/post', function(request, response){
    console.log(request.body.Name);
    pool.query("INSERT INTO trees VALUES('"+request.body.Name+"',"+request.body.Latitude+","+request.body.Longitude+","+request.body.TreeHeight+");", (err1, res1) => 
        {        
            if(err1) 
                {return console.log(err1);}
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/plain');
                response.end('Data Store Success!\n');      
        }); 
});
//Pushes files from server to client. like "index html"
app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, {root: _app_folder});
});
// ---- START UP THE NODE SERVER  ----
app.listen(_port, function () {
    console.log("Node Express server for " + app.name + " listening on http://localhost:" + _port);
});
