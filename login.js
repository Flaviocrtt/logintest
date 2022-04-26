const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { dirname } = require('path');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aaf56#54',
    database: 'nodelogin'
});

const app = express();

app.use(session({
    secret: 'logintestsecret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function (request, response) {

    if (request.session.loggedin) {

        response.sendFile(path.join(__dirname, "home.html"), function(){
            response.end();
        })
    } else {
        response.sendFile(path.join(__dirname, "login.html"), function(){
            response.end();
        })
    }
});

app.post('/auth', (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
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

app.post('/logout', (request, response) => {
    if (request.session.loggedin) {
        request.session.loggedin = false;
        request.session.username = null;
        response.redirect('/');
    }
})

app.listen(3000)