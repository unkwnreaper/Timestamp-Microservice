// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// get current date
app.get("/api", function(req, res, next) {
  req.unix = parseInt(new Date().valueOf()); // get time unix
  req.time = new Date().toUTCString();  // get time UTC
  next();
}, function(req, res) {
  res.json({unix: req.unix,utc: req.time});
});

// get utc time
app.get("/api/*", function(req, res, next) {
  var unixRegex = /^\/api\/[0-9]+$/;
  var commaRegex = /^\/api\/:?([0-9]+,)*[0-9]+$/;
  if (unixRegex.test(req.url)) var entryDate = new Date(parseInt(req.url.replace(/^\/api\//,'')));
  else if (commaRegex.test(req.url))  entryDate = new Date(...req.url.replace(/^\/api\/:?/,'').replace(/\?$/, '').split(","));
  else {
    var dateString = req.url.replace(/%20/g, " ").replace(/^\/api\/:?/,'').replace(/\?$/, '');
    if (req.url.includes("GMT") ||  req.url.includes("UTC"))  var entryDate = new Date(dateString);
    else  var entryDate = new Date(dateString + ", UTC");
  }
  req.unix = parseInt(entryDate.valueOf()); // get time unix
  req.utc = entryDate.toUTCString();  // get time UTC
  next();
}, function(req, res) {
  if (req.utc == "Invalid Date")  res.json({error: "Invalid Date"});
  else res.json({unix: req.unix,utc: req.utc});
});

app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
