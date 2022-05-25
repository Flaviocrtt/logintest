const express = require('express');
const router = express.Router();
const path = require('path');

const mysql = require('mysql');
const { response } = require('express');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aaf56#54',
    database: 'logintest',
});

router.get('/', function (request, response) {

    if (request.session.loggedin) {

        response.render('home', {fullName: request.session.fullName});
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
                console.log(results);
                request.session.loggedin = true;
                request.session.username = username;
                request.session.fullName = `${results[0].firstName} ${results[0].lastName}`;
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

router.get('/createaccount', (request, response) => {
    response.render('createAccount');
})

router.post('/register', async (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    let firstName = request.body.firstName;
    let lastName = request.body.lastName;

    if (username && password) {
       
        connection.query('INSERT INTO Users (email, password, firstName, lastName, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)', 
        [username, password, firstName, lastName, new Date(), new Date()], 
        function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            response.redirect('/');
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

module.exports = router;
