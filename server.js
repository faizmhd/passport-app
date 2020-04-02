let express  = require('express');
let app      = express();
let mongoose = require('mongoose');
let passport = require('passport');
let flash    = require('connect-flash');
require('dotenv').config()

let morgan       = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');
let session      = require('express-session');

// DB config
let configDB = require('./config/database.js');
mongoose.connect(configDB.url, {useNewUrlParser: true, useUnifiedTopology: true});

require('./config/passport')(passport);

app.use(morgan('dev')); 
app.use(cookieParser()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up the ejs templating
app.set('view engine', 'ejs');

// Passport init
app.use(session({ secret: 'passport-js', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(process.env.SERVER_PORT);
console.log(process.env.TITLE +  ' is running on port : ' + process.env.SERVER_PORT);
