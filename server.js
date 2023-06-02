
var express = require("express");
var app = express();

const blogService = require('./blog-service');
const service = require('./service');


var HTTP_PORT = process.env.PORT || 8080;

// Set up static file serving
app.use(express.static('public'));

// Setup a route to redirect "/" to "/about"
app.get("/", (req, res) => {
    res.redirect("/about");
});

// Setup a route to return the about.html file from the views folder
app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/views/about.html");
});

// Start the server and listen on the specified port
app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on port " + HTTP_PORT);
});


