var db = require("../models");

module.exports = function (app) {
    // Render Main page
    app.get("/", (req, res) => {
        db.Article.find({})
        .sort({created: -1})
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