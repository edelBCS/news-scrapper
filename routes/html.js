var db = require("../models");

module.exports = function (app) {
    app.get("/", (req, res) => {
        db.Article.find({})
        .then(articles => {
            res.render("index", {articles})
        })
        .catch(err => {
            console.log(err);
        });        
    });

    // Render 404 page for any unmatched routes
    app.get("*", function (req, res) {
        res.render("404");
    });
};