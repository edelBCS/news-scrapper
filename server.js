var express = require("express");
var exphbs = require("express-handlebars");
var axios = require("axios");
var mongoose = require("mongoose");
var cheerio = require("cheerio");



// Init Express and define port
var app = express();
var PORT = process.env.PORT || 3000;

// Express Middleware to parse body as JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Express Middleware to set public folder as Static
app.use(express.static("public"));

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB(for heroku)
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Routes
require("./routes/api")(app);

// Start the server
app.listen(PORT, function() {
    console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
    );
});

module.exports = app;