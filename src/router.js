const express = require('express');
const router = express.Router();
const path = require('path');

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aaf56#54',
    database: 'logintest',
});


router.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next();
 });

router.get('/', function (request, response) {

    if (request.session.loggedin) {

        response.render('home', {username: request.session.username});
    } else {

        response.render('login');
    }
});

router.post('/auth', async (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    if (username && password) {
       
        connection.query('SELECT * FROM Users WHERE email = ? AND password = ?', [username, password], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

router.post('/logout', (request, response) => {
    if (request.session.loggedin) {
        request.session.loggedin = false;
        request.session.username = null;
        response.redirect('/');
    }
})

module.exports = router;
