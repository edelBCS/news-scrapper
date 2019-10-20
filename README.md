# Magic: The Gathering(MTG) News-scrapper

## Installation
* Install node packages: ```npm install```
* Start server: ```npm run dev```

## Technologies
* NodeJS
* ExpressJS
* cheerio
* axios
* handlebarsJS
* mongoDB/mongooseJS

## What is this?
This is a MTG news site that scrapes articles from mtggoldfish.com.  Users can leave likes and comments on articles.

![Scrape Button](./public/img/readMeScraper.jpg "Scrape Button")

A user can initiate a scrape by clicking the button in the site banner.  This will re-scrape the newest articles and save them to the sites mongo database.
