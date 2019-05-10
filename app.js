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

function getKursplan(benamning, kurskod) {
    var p = new Promise(function (resolve, reject) {

        soap.createClient(apiWSDL, (err, client) => {
            if (err) throw new Error(err);

            var args = {
                benamning: benamning,
                kurskod: kurskod,
                startveckaFrom: '',
                startveckaTom: '',
                sortering: 'kurskod',
            }

            var response = client.sokKursplanStartvecka(args, (err, res) => {
                if (err) throw new Error(err);

                if (res == null) {
                    throw new Error('No results!');
                }

                var kurser = [];

                for (let i = 0; i < res.return.length; i++) {
                    let namn = res.return[i].kurs.namn;
                    let kod = res.return[i].kurs.kurskod;
                    let kurs = kod + ' - ' + namn;

                    if (!kurser.includes(kurs)) {
                        kurser.push(kurs);
                    }
                }
                console.log(kurser);
                console.log(kurser.length); 
                console.log('nr of results: ' + res.return.length);

            });
        });
    });
}

getKursplan('matematik', '');

/*
function getWeek(fromOrTo, year, period) {

    // Check week and year
    if (period < 1 || period > 4) {
        throw new Error('Invalid period: ' + period);
    }
    if (year > new Date().getFullYear() || year < 1990) {
        throw new Error('Invalid year: ' + year);
    }

    if (fromOrTo == 'from') {
        if (period < 3) {
            year = (year - 1) + '';

            if (period == 1) {
                return year + '' + '36';
            } else {
                return year + '' + '44';
            }
        } else {
            if (period == 3) {
                return year + '' + '04';
            } else {
                return year + '' + '13';
            }
        }
    } else if (fromOrTo == 'to') {

        if (period == 1) {
            year = (year - 1) + '';
            return year + '' + '43';

        } else if (period == 2) {
            return year + '' + '03';

        } else if (period == 3) {
            return year + '' + '12';

        } else {
            return year + '' + '23';
        }
    } else {
        throw new Error('Invalid fromOrTwo: ' + fromOrTo);
    }
}
*/

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