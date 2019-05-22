'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
const rp = require('request-promise');
const c = require('cheerio');

var soap = require('soap');
var apiWSDL = 'http://test-ws.selma7.its.uu.se/selmaws-uu/services/PlanTjanst?wsdl';

const webScrapeUrl = 'http://www.uu.se/utbildning/utbildningar/selma/studieplan/?pKod=';

var selmaSearchResult = {};

var kurskoder = {
    TEL2Y: [],
    TES2Y: [],
    TTF2Y: [],
    TIT2Y: [],
    TKT2Y: [],
    TTM2Y: [],
    TST2Y: [],
    TMV2Y: [],
    TMB2Y: [],
    TEL1Y: [],
    TME1Y: [],
    TDV1K: []
}

function populatekurskoder() {
    for (let kurs in kurskoder) {

        let url = webScrapeUrl + kurs;

        rp(url)
            .then((html) => {

                //success!
                const courses = [];
                var html = c('ul.semesterContent > li > a', html);
                for (let i = 0; i < html.length; i++) {
                    let str = html[i].children[0].data;
                    let slices = str.split("(");
                    let code = slices[slices.length-1].slice(0, 6);
                    courses.push(code);
                }
                kurskoder[kurs] = courses;
            })
            .catch(function (err) {
                //handle error
                //console.log(err);
            });
    }
}

populatekurskoder();

function filterProgram(programCode) {
    let coursecodes = kurskoder[programCode];
    let res = {};

    for (let i = 0; i < coursecodes.length; i++) {
        if (coursecodes[i] in selmaSearchResult) {
            res[coursecodes[i]] = selmaSearchResult[coursecodes[i]];
        }
    }
    selmaSearchResult = res;
};

io.on('connection', function (socket) {
    async function search(data) {
        selmaSearchResult = await getKursplan(data, '');
        socket.emit('searchResult', selmaSearchResult);
    }

    socket.on('search', data => {
        if (lengthOfObject(selmaSearchResult) < 1) search(data);
        else {
            filterProgram('TIT2Y');
            socket.emit('searchResult', selmaSearchResult);
        }
    })

    socket.on('filterProgram', code => {
        filterProgram(code);
        socket.emit('searchResult', selmaSearchResult);
    })
});


// Hur skiljer vi på kurskod och kursnamn?
// Hur ska vi begränsa antalet resultat, typ att man måste ha minst tre 
// bokstäver/siffror i söktermen? 

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

function lengthOfObject(obj) {
    let n = 0;
    for (let o in obj) {
        n++;
    }
    return n;
}