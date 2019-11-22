const express = require('express');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const config = require('./config/config');
const helpers = require('./config/helpers');
const connectDB = require('./config/db');
const app = express();

// Handlebars Middleware
let hbs = exphbs.create({ helpers: { formatDate: helpers } });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

// Session Middleware
app.use(
  session({
    secret: 'abv_sol_andrei',
    resave: true,
    saveUninitialized: true
  })
);

// Handle session locals
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.token = req.session.token;
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connectDB();

// Set the routes
app.use('/', require('./routes/index'));
app.use('/articles', require('./routes/articles'));
app.use('/users', require('./routes/users'));

// Start the server
app.listen(config.PORT, console.log(`Server: Started on port ${config.PORT}`));
