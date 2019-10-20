// Require DB models
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app){
    app.get("/scrape", (req, res) => {
        axios.get("https://www.mtggoldfish.com/articles").then(response => {
            var $ = cheerio.load(response.data);
            var articles = [];
            $(".article-tile").each((i, element) => {
                var result = {};

                result.title = $(element).children("h2").children("a").text();
                result.link = $(element).children("h2").children("a").attr("href");
                result.author = $(element).children("h3").children("a").text();
                result.abstract = $(element).children("p").text();

                articles.push(result);
            });

            res.send(articles);
        });
    });
};
