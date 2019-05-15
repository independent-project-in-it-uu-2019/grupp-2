'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var soap = require('soap');
var apiWSDL = 'http://test-ws.selma7.its.uu.se/selmaws-uu/services/PlanTjanst?wsdl';

// Hur skiljer vi på kurskod och kursnamn?
// Hur ska vi begränsa antalet resultat, typ att man måste ha minst tre 
// bokstäver/siffror i söktermen? 

var kurser = [];

function getKursplan(benamning, kurskod) {
    console.log('Searching...');
    return new Promise(function (resolve, reject) {

        soap.createClient(apiWSDL, (err, client) => {
            if (err) throw new Error(err);

            var args = {
                benamning: benamning,
                kurskod: kurskod,
                startveckaFrom: '',
                startveckaTom: '',
                sortering: 'startvecka',
            }

            var response = client.sokKursplanStartvecka(args, (err, res) => {
                if (err) throw new Error(err);

                if (res == null) {
                    resolve(res);
                } else {
                    //console.log(res.return);

                    var kurser = {};
                    for (let i = 0; i < res.return.length; i++) {
                        let kurskod = res.return[i].kurs.kurskod;
                        let namn = res.return[i].kurs.namn;
                        let startvecka = res.return[i].startvecka;


                        if (kurser[kurskod] == undefined) {
                            kurser[kurskod] = {
                                namn: namn,
                                startvecka: [startvecka]
                            }
                        } else {
                            kurser[kurskod].startvecka.push(startvecka);
                        }
                    }
                    resolve(kurser);
                }
            });
        });
    });
}
//getKursplan('', '1DT350');

io.on('connection', function (socket) {
    socket.emit('initialize', 'Hej klient!');
    async function search(data) {
        var kurser = await getKursplan(data, '');
        console.log(kurser);
        socket.emit('searchResult', kurser);
    }

    socket.on('search', data => {
        search(data);
    })
});

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