var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");



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
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true } );
// mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true, useUnifiedTopology: true } );

// Routes
require("./routes/api")(app);
require("./routes/html")(app);

// Start the server
app.listen(PORT, function() {
    console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
    );
});

module.exports = app;