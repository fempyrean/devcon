const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// REQUIRING ROUTES
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
// Passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').mongoURI;
// Connecting to mongoDB
const connection = mongoose.connect(db, { useNewUrlParser: true });
connection.then((res) => {
    console.log('MongoDB Connected');
});
connection.catch((err) => {
    console.log(err);
});

// USING ROUTES
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// Listening on port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));