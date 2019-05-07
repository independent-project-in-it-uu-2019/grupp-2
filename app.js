'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBRztgI8vk5XUSZukJgfkGWagA2rgDfk-c",
    authDomain: "kandidat-50dc2.firebaseapp.com",
    databaseURL: "https://kandidat-50dc2.firebaseio.com",
    projectId: "kandidat-50dc2",
    storageBucket: "kandidat-50dc2.appspot.com",
    messagingSenderId: "410767555631",
    appId: "1:410767555631:web:e284f8533f8a5f02"
  };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Pick arbitrary port for server
var port = 3000;
app.set('port', (process.env.PORT || port));

// Serve static assets from public/
app.use(express.static(path.join(__dirname, 'public/')));

// Serve index.html directly as root page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Serve course.html as /kurs
app.get('/kurs', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/kurs.html'));
});

// Serve admin.html as /admin
app.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/admin.html'));
});

var server = http.listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
});
