const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.connect(config.database);

//check if connection is successful
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' +config.database);
});

//if error
mongoose.connection.on('error', (err) => {
    console.log('Database error ' +err);
});

//initialize app
const app = express();

const users = require('./routes/users');

//port for development
const port = 3000;

app.use(cors());

//set static folder 
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

//Index route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');   
});

//all routes by default lead to index page
app.get('*', (req, res) => {
    res.redirect('/');
});

//Start server
app.listen(port, () => {
    console.log('Server started on port ' +port);
});


