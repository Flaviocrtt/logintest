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

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.listen(3001, () => console.log('app running'));