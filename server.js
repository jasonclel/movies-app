var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var cors = require('cors')

var RECENTLY_WATCHED = "watched";

var app = express();
app.use(bodyParser.json());

var distDir = _dirname +"/dist/"
app.use(express.static(distDir));


var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test",  function(err, client){
    if(err){
        console.log(err);
        process.exit(1);
    }

    db = client.db();
    console.log("Database Connected Successfully")

    var server = app.listen(process.env.PORT || 8080, function(){
        var port = server.address().port;
        console.log("App running on port", port);
    });
});

function handleError(res, reason, message, code){
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

app.get("/api/watched", function(req, res){
    db.collection(RECENTLY_WATCHED).find({}).toArray(function(err, docs){
        if(err){
            handleError(res, err.message, "Failed to get Movies");
        } else {
            res.status(200).json(docs)
        }
    })
});

app.post("/api/watched", function(req, res){
    var newMovie = req.body;
    newMovie.createDate = new Date();

    if(!req.body.movieURL){
        handleError(res, "Could not find watched movie", 400)
    } else {
        db.collection(RECENTLY_WATCHED).insertOne(newMovie, function(err, doc){
            if(err){
                handleError(res, err.message, "Failed to save movie history")
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

//app.options("/api/movies", cors())
app.get("/api/movies", function(req, res){
    var https = require("https");
    var url = "https://demo2697834.mockable.io/movies"

    https.get(url, function(response){
        var body='';
        response.on('data', function(chunk){
            body += chunk;
        });

        response.on('end', function(){
            var source = JSON.parse(body);
            var movies = source.entries;
            console.log(movies);
            res.json(movies);
        });
    });
});