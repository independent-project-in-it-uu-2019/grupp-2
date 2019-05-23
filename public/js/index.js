var server = io();
var modal = document.getElementById("modal");

server.on("initialize", function (data) {
    console.log(data);
});

var valdProgramkod = "alla";
var valdLasar = "alla";
var valdPeriod = "alla";
var noKursrapport = false;
var noKursvardering = false;

$(document).ready(function(){
    $("#program").change(function(){
        valdProgramkod = $(this).children("option:selected").val();
    });
    $("#lasar").change(function(){
        valdLasar = $(this).children("option:selected").val();
    });
    $("#period").change(function(){
        valdPeriod = $(this).children("option:selected").val();
    });
});

function searchCourse() {
    let text = $('#searchBox').val();
    noKursrapport = $('#noKursrapport').is(':checked');
    noKursvardering = $('#noKursvardering').is(':checked');

    let searchObj = {
        text: text,
        noKursrapport: noKursrapport,
        noKursvardering: noKursvardering,
        valdProgramkod: valdProgramkod,
        valdLasar: valdLasar,
        valdPeriod: valdPeriod
    }

    if (valdProgramkod == "alla" && text.length < 3) {
        alert('Ange en längre sökterm!');
    } else {
        modal.style.display = "block";
        server.emit('search', searchObj);

        server.on('searchResult', data => {
            modal.style.display = "none";

            if (data != null) {
                makeCourses(data);
            } else {
                alert('Inga resultat!');
            }
        });
    }
}

function makeCourses(data) {
    $('#tbody').html('');

    for (kurs in data) {
        let kurskod = kurs;
        let namn = data[kurs].namn;
        let years = getYears(data[kurs].startvecka);
        let periods = getPeriods(data[kurs].startvecka);

        createRow(kurskod, namn, years, periods);
    }
}

function getYears(startvecka) {
    var years = [];

    for (let i = 0; i < startvecka.length; i++) {
        if (startvecka[i] != undefined) {
            let year = startvecka[i].slice(0, 4);
            if (!years.includes(year)) years.push(year);
        }
    }
    return years.sort().reverse();
}

function getPeriods(startvecka) {
    var periods = [];

    for (let i = 0; i < startvecka.length; i++) {
        if (startvecka[i] != undefined) {
            let period = 1;
            let vecka = startvecka[i].slice(4, 6);

            if (vecka < 12) {
                period = 3;
            } else if (vecka < 23) {
                period = 4;
            } else if (vecka < 36) {
                period = 1;
            } else {
                period = 2;
            }
            if (!periods.includes(period)) periods.push(period);
        }

    }
    return periods.sort();
}

function createRow(kurskod, namn, years, periods) {
    var kortNamn = namn.slice(0, 6);

    var tbody = document.getElementById('tbody');

    var tr = document.createElement('tr');
    tr.setAttribute('class', 'course');

    var kursnamn = document.createElement('td');
    kursnamn.setAttribute('class', 'white kursnamn');
    kursnamn.setAttribute('onclick', "navigate('" + kurskod + "','" + namn + "')");
    kursnamn.innerHTML = kurskod + ' - ' + namn;
    tr.appendChild(kursnamn);

    var period = document.createElement('td');
    period.setAttribute('class', 'grey center');

    if (periods.length > 1) {
        var selectPeriod = document.createElement('select');
        selectPeriod.setAttribute('class', 'grey');
        for (let i = 0; i < periods.length; i++) {
            let o = document.createElement('option');
            o.setAttribute('value', periods[i]);
            o.innerHTML = periods[i];

            selectPeriod.appendChild(o);
        }
        period.appendChild(selectPeriod);
    } else {
        period.innerHTML = periods[0];
    }
    tr.appendChild(period);

    var year = document.createElement('td');
    year.setAttribute('class', 'white center');

    if (years.length > 1) {
        var selectYear = document.createElement('select');
        selectYear.setAttribute('class', 'white');

        for (let i = 0; i < years.length; i++) {
            let o = document.createElement('option');
            o.setAttribute('value', years[i]);
            o.innerHTML = years[i];

            selectYear.appendChild(o);
            year.appendChild(selectYear);
        }
    } else {
        year.innerHTML = years[0];
    }
    tr.appendChild(year);

    var svar = document.createElement('td');
    svar.setAttribute('class', 'grey center');
    svar.innerHTML = Math.floor(Math.random() * 100) + '%';
    tr.appendChild(svar);

    var ok = true;

    var kursvard = document.createElement('td');
    var kursvardSaknas = Math.random() < 0.5;
    if (kursvardSaknas) {
        kursvard.innerHTML = 'Saknas';
        kursvard.setAttribute('class', 'saknas-light');
    } else {
        let a = document.createElement('a');
        a.innerHTML = 'Kursvärd_' + kortNamn + '.pdf';
        a.setAttribute('href', 'http://mingodamat.se');
        kursvard.appendChild(a);
        if (noKursvardering) ok = false;
    }
    tr.appendChild(kursvard);

    var kursrapport = document.createElement('td');
    var kursrapportSaknas = Math.random() < 0.2;
    if (kursrapportSaknas) {
        kursrapport.innerHTML = 'Saknas';
        kursrapport.setAttribute('class', 'saknas');
    } else {
        let a = document.createElement('a');
        a.innerHTML = 'Kursrapport_' + kortNamn + '.pdf';
        a.setAttribute('href', 'http://mingodamat.se');
        kursrapport.appendChild(a);
        kursrapport.setAttribute('class', 'grey');
        if (noKursrapport) ok = false;
    }
    tr.appendChild(kursrapport);

    var kursomdome = document.createElement('td');
    var kursomdometSaknas = Math.random() < 0.2;
    if (kursomdometSaknas) {
        kursomdome.innerHTML = 'Saknas';
        kursomdome.setAttribute('class', 'saknas-light center');
    } else {
        let omdome = Math.floor(Math.random() * 50) / 10;
        kursomdome.innerHTML = omdome;
        if (omdome < 2) kursomdome.setAttribute('class', 'warning center white');
        else if (omdome >= 4) kursomdome.setAttribute('class', 'good center white');
        else kursomdome.setAttribute('class', 'center white');
    }
    tr.appendChild(kursomdome);

    var godkandAndel = document.createElement('td');
    var godkandAndelSaknas = Math.random() < 0.2;
    if (godkandAndelSaknas) {
        godkandAndel.innerHTML = 'Saknas';
        godkandAndel.setAttribute('class', 'saknas center');
    } else {
        godkandAndel.innerHTML = Math.floor(Math.random() * 100) + '%';
        godkandAndel.setAttribute('class', 'grey center');
    }
    tr.appendChild(godkandAndel);

    if (ok) {
        tbody.appendChild(tr);
        var spacer = document.createElement('tr');
        spacer.setAttribute('class', 'spacer');
        tbody.appendChild(spacer);
    }
}

function navigate(kurskod, namn) {
    localStorage.setItem("kursnamn", namn);
    localStorage.setItem("kurskod", kurskod);
    window.location.href = '/kurs?=' + kurskod;
}

var moreORless = -1;
function doAvancerat()
{
    if (moreORless < 0) {
        $('#avancerat').css('height', '220px');
        $('#avancerat').css("border-color", "#d8d8d8");
        $("#moreORless").css("transform", "rotate(-180deg)");
        $(".searchbox").css("width", "100%")
    } else {
        $('#avancerat').css('height', '0px');
        $('#avancerat').css("border-color", "#0000");
        $("#moreORless").css("transform", "rotate(0deg)");
        $(".searchbox").css("width", "500px")
    }
    moreORless = -moreORless;
}