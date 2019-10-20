var axios = require("axios");

module.exports = function (app) {
    app.get("/", (req, res) => {

        //CALL DB Instead of Scraper
        axios.get("http://" + req.headers.host + "/api/scrape")
        .then(articles => {
            res.render("index", {articles: articles.data});
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