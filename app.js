'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var soap = require('soap');
var apiWSDL = 'http://test-ws.selma7.its.uu.se/selmaws-uu/services/PlanTjanst?wsdl';

function getKursplan() {
    var p = new Promise(function (resolve, reject) {

        soap.createClient(apiWSDL, (err, client) => {
            if (err) throw new Error(err);

            var args = {
                benamning: '',
                kurskod: '',
                startveckaFrom: '201901',
                startveckaTom: '201910',
                sortering: '',
            }

            var response = client.sokKursplanStartvecka(args, (err, res) => {
                if (err) throw new Error(err);

                console.log(res.return[0]);


                /*
                for (let i = 0; i < res.return.length; i++) {
                    console.log(res.return[i]);
                }
                */
            });
        });
    });
}


getKursplan();

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

// Serve login.html as /login
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

var server = http.listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
});