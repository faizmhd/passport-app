let express  = require('express');
let app      = express();
let mongoose = require('mongoose');
let passport = require('passport');
require('dotenv-flow').config();

let morgan       = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');
let session      = require('express-session');
let cors         = require('cors');
let helmet = require('helmet');

const port = process.env.SERVER_PORT || 8000;
const title = process.env.TITLE || 'Passport App';

// DB config
let configDB = require('./config/database.js');
mongoose.connect(configDB.url, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((e) => {
    console.log("Error while DB connecting");
    console.log(e);
  });

require('./config/passport')(passport);

app.use(cors());
app.use(helmet());
app.use(morgan('dev')); 
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport init
app.use(session({ secret: 'passport-js', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log(title +  ' is running on port : ' + port);
