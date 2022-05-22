const express = require('express');
const session = require('express-session');
const { dirname } = require('path');
const path = require('path');
const router = require('./src/router');

const app = express();

app.use(session({
    secret: 'logintestsecret',
    resave: true,
    saveUninitialized: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/src/views'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.listen(3000, () => console.log('app running'));