const SERVER_PORT = 8142;
var express = require('express');
var mongodb = require('mongodb');
var user = 'c_panasuriya';
var password = 'A00442907';
var database = 'c_panasuriya';

var host = '127.0.0.1';
var port = '27017'; 

var connectionString = 'mongodb://' + user + ':' + password + '@' +
    host + ':' + port + '/' + database;
console.log(connectionString);

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
};

var app = express();
app.use(express.bodyParser());
app.use(allowCrossDomain);
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/css', express.static(__dirname + '/css'));
app.use(express.static(__dirname));

var collection;
const NAME_OF_COLLECTION = 'universities';

mongodb.connect(connectionString, function (error, db) {
    
    if (error) {
        throw error;
    }//end if

    collection = db.collection(NAME_OF_COLLECTION);

    // Close the database connection and server when the application ends
    process.on('SIGTERM', function () {
        console.log("Shutting server down.");
        db.close();
        app.close();
    });

 //now start the application server
    var server = app.listen(SERVER_PORT, function () {
    console.log('Listening on port %d',
        server.address().port);
    });
});

app.get('/hello', function (request, response) {
    return response.send(200, '<h1>Hello World!!!</h1>'+ __dirname);
});

app.post('/saveUniversity', function (request, response) {


    console.log("saveUniversity being executed in " + __dirname);
    console.log(request.body);
    
    collection.insert(request.body, 
        function (err, result) {//use empty to get all records
           if (err) {
               return response.send(400,'An error occurred saving a record.');
           }//end if

           return response.send(200, "Record saved successfully.");
       });
});

app.post('/readUniversity', function (request, response) {

    var key = request.body;
    
    collection.find(key, function (err, result) {

          if (err) {
              return response.send(400,'An error occurred retrieving records.');
          }
       result.toArray(
           function (err, resultArray) {
           if (err) {
               return response.send(400, 'An error occurred processing your records.');
           }
           return response.send(200, resultArray);
       });
      });

    });

    app.post('/removeUniversity', function (request, response) {
        collection.remove(
            {'Name': request.body.Name},
            function (err, returnedStr) {
                if (err) {
                    return response.send(400,'An error occurred retrieving records.');
                }
                var obj = JSON.parse(returnedStr);
                console.log(obj.n + " records");
                return response.send(200, returnedStr);
        });
    });