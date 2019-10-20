// Require DB models
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app){
    // Scrapes articles from mtggoldfish.com and adds them to DB
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

                db.Article.findOne({title: result.title})
                    .then(qryResult => {
                        if (qryResult)
                            db.Article.updateOne(
                                {
                                    title: result.title
                                },
                                {
                                    $set: {
                                        title: result.title,
                                        link: result.link,
                                        author: result.author,
                                        abstract: result.abstract,
                                        image: result.image
                                    }
                                }
                            )
                            .then(dbUpdate => {
                                console.log("Article updated:" + dbUpdate);
                            })
                            .catch(err => {
                                console.log(err);
                            });
                        else{
                            db.Article.create(result)
                            .then(dbArticle => {
                                console.log("New Article added:" + dbArticle);
                            })
                            .catch(err => {
                                console.log(err);
                            });
                        }
                    })
                articles.push(result);
            });

            res.send(articles);
        });
    });

    //finds Article and all its comments
    app.get("/api/article/:id", (req, res) => {
        db.Article.findOne({_id: req.params.id})
        .populate("comments")
        .then(dbArticle => {
            res.json(dbArticle);
        })
        .catch(err => {
            console.log(err);
        });
    });

    // Adds new comment to article
    app.post("/api/comment/:id", (req, res) => {
        db.Comment.create(req.body)
            .then(dbComment => {
                return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {comments: dbComment._id}}, {new: true});
            })
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });
};
