const express = require("express");
var exphbs  = require('express-handlebars');

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const logger = require("morgan");
const request = require("request");
const axios = require("axios");
//require models
const db = require("./models");
const PORT = process.env.PORT || 3000;


var app = express();
app.engine('handlebars', exphbs({defaultLayout: 'index'}));
app.set('view engine', 'handlebars');

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/SKRAPE";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

app.get("/", function(req, res){
    res.render('main');
  })

app.get("/scrape", function(req, res) {
  axios.get("https://www.gq.com/about/hip-hop").then(function(response) {
    
  var $ = cheerio.load(response.data);

    $("h2.title-card__hed").each(function(i, element) {
      var result = {};

      result.title = $(this)
      .text();

      result.link = $(this)
      .attr("href");

      db.Blog.create(result)
        .then(function(dbBlog) {
          console.log(dbBlog);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });

    res.send("SKRAPE COMPLETE DAWG, GET UP ON OUTTA HERE");
  });
});

app.get("/", function(req, res){
    res.render('main');
  })

app.get("/Blogs", function(req, res) {
  db.Blog.find({})
    .then(function(dbBlog) {
      res.json(dbBlog);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/Blogs/:id", function(req, res) {
  db.Blog.findOne({ _id: req.params.id })
    .populate("Note")
    .then(function(dbBlog) {
      res.json(dbBlog);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/Blogs/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Blog.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbBlog) {
      res.json(dbBlog);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
