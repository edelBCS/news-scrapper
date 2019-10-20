// Require DB models
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app){
    app.get("/api/scrape", (req, res) => {
        axios.get("https://www.mtggoldfish.com/articles").then(response => {
            var $ = cheerio.load(response.data);
            var articles = [];
            $(".article-tile").each((i, element) => {
                var result = {};

                result.title = $(element).children("h2").children("a").text();
                result.link = $(element).children("h2").children("a").attr("href");
                result.author = $(element).children("h3").children("a").text();
                result.abstract = $(element).children("p").text();

                var image = $(element).children("div").children("div").children("div").attr("style");
                var imageURL = image.split("'");
                result.image = imageURL[1];

                //SAVE ARTICLES TO DB

                articles.push(result);
            });

            res.send(articles);
        });
    });
};
