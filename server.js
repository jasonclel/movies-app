var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var WATCH_HISTORY = "recentlyWatched";

var app = express();
app.use(bodyParser.json());

//instructs express as to where the build file is located
var distDir = __dirname +"/dist/"
app.use(express.static(distDir));

//static database variable
var db;

//establishes link with the mongo db
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

//handles any errors thrown by the database and api requests
function handleError(res, reason, message, code){
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

//gets the list of watched films from the database
app.get("/api/watched", function(req, res){
    db.collection(WATCH_HISTORY).find({}).toArray(function(err, docs){
        if(err){
            handleError(res, err.message, "Failed to get Movies");
        } else {
            res.status(200).json(docs);
        }
    })
});

//adds a new film to the database from the angular client side
app.post("/api/watched", function(req, res){
    var newMovie = req.body;
    newMovie.createDate = new Date();

    if(!req.body.title){
        handleError(res, "Could not find watched movie", 400)
    } else {
        db.collection(WATCH_HISTORY).insertOne(newMovie, function(err, doc){
            if(err){
                handleError(res, err.message, "Failed to save movie history")
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

//deletes a specific film from the database
app.delete("/api/watched", function(req, res){
    db.collection(WATCH_HISTORY).deleteOne({id: (req.params.id)}, function(err, result){
        if (err) {
            handleError(res, err.message, "Failed to remove Movie");
        } else {
            res.status(200).json(req.params.id);
        }
    })
})

//gets the movies data from the provided api
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