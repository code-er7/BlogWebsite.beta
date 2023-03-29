
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();


//creating storage spaces 

mongoose.connect("mongodb://localhost:27017/BlogWebsite");
const postSchema = {
  postTitle: String,
  postBody: String
};
const postt = mongoose.model("post", postSchema);
async function defaultdataInserter()
{
    try{

       const post = new postt({
        postTitle: "Steps to Compose",
        postBody: "Hey User ! If you want to compose new blogs -- first you should have mongoDB installed in your computer , and after that click the url and add /compose in it."
      });
      await post.save();
       console.log("Default Item inserted");
    }
    catch(err)
    {
      console.log(err);
    }

}

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", function (req, res) {
  datafinder();
  async function datafinder() {
    try {
      const poste = await postt.find();
      if(poste.length==0)
      {
       defaultdataInserter();
       res.redirect("/");
      }
      res.render("home", { para1: homeStartingContent, post: poste });
    }
    catch (err) {
      console.log(err);
    }
  }
})
app.get("/about", function (req, res) {
  res.render("about", { aboutP: aboutContent });
})
app.get("/contact", function (req, res) {
  res.render("contact", { contactP: contactContent });
})
app.get("/compose", function (req, res) {
  res.render("compose");
})
app.post("/compose", function (req, res) {
  datainterter();
  async function datainterter() {
    try {
      const post = new postt({
        postTitle: req.body.input1,
        postBody: req.body.input2
      });
      await post.save();
      console.log("new post saved ");
    }
    catch (err) {
      console.log(err);
    }
  }
  res.redirect("/");
})
app.get("/post/:postnames", function (req, res) {
  var got = _.lowerCase(req.params.postnames);
  datafinder2();
  async function datafinder2() {
    try {
      const poste = await postt.find();
      poste.forEach(function(post) {
        var checker = _.lowerCase(post.postTitle);
        if (checker == got) {
          res.render("post", { gotcha: post });
        }
      });
    }
    catch (err) {
      console.log(err);
    }
  }

});





app.listen(3000, function () {
  console.log("Server started on port 3000");
});
