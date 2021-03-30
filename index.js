require('dotenv').config({path: './.env'});
global.BaseURL = "http://localhost:3000/";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const auth = require("./routes/auth");
const userRoute = require("./routes/user");
const errorController = require("./controllers/error");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const User = require("./models/user");
const flash = require("connect-flash");
const db = require("./utils/database"); 
const store = new MongoDBStore({ uri: "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@cluster0.gvwj0.mongodb.net/MarkComDB",collection: 'sessions'});
const csrfProtection = csrf();
app.set('view engine', 'ejs');
app.use(express.static(__dirname +"/public"));
app.use("/css",express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use("/js",express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use("/js",express.static(__dirname + '/node_modules/jquery/dist'));
app.use("/js",express.static(__dirname + '/node_modules/@popperjs/core/dist/umd'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie:{maxAge:1000 * 60 * 60 * 24 * 1}   // msec sec mins hours day
}));
app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        return next();
      }
      req.user = user
      next();
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
});
app.use((req,res,next)=>{
  res.locals.csrfToken = req.csrfToken();
  res.locals.success = false;
  res.locals.error = false;
  next();
});

app.use("/auth",auth);

app.use("/user",userRoute);

app.get('/', (req, res) => {
  res.render("home.ejs",{pageTitle:"Home"});
});

app.use(errorController.getError403);

app.use(errorController.getError500);

app.use(errorController.getError404);


db().then(()=>{
  app.listen(3000, function () {
    console.log("Server started on port 3000.");
  });
}).catch(()=>{
  console.log("Unable to connect");
})