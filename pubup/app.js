const express = require('express')
const bodyparser = require('body-parser')
const request = require("request");
const https = require("https")
const ejs = require('ejs')
const mongoose = require('mongoose');
const nodemailer = require('nodemailer')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')




const app = express();
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public/'));
app.use(bodyparser.urlencoded({ extended: true }))





// Mongodb connection url
mongoose.connect("mongodb://localhost:27017/clubs", { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    firstName: String,
    email: String,
    contactNumber: String,
    gender: String,
    birthday: String,
    aniversary: String,
    password: String

});
userSchema.plugin(passportLocalMongoose);
const clubUsers = mongoose.model("clubUsers", userSchema)
passport.use(clubUsers.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get("/", function(req, res) {
    res.render("login")
})

app.get("/info", function(req, res) {
    res.render("info")
})

app.get("/clubs", function(req, res) {
    res.render("clubs")
})

app.post("/login", function(req, res) {
    clubUsers.register({ username: req.body.firstName }, req.body.password, function(err, user) {
        if (err) {
            console.log(err)
            res.redirect("login")
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("clubs")
            })
        }
    })
})


app.listen(process.env.PORT || 2000, function() {
    console.log("server is running successfully on port made by om kadam");
})