var server = io();
var modal = document.getElementById("modal");

server.on("initialize", function (data) {
    console.log(data);
});

$('body').keypress(function (e) {
    if (e.which == 13) {
        searchCourse();
    }
});

var valdProgramkod = "alla";
var valdLasar = "alla";
var valdPeriod = "alla";
var noKursrapport = false;
var noKursvardering = false;
var courseGradeLow = 0;
var couseGradeHigh = 5;

$(document).ready(function () {
    $("#program").change(function () {
        valdProgramkod = $(this).children("option:selected").val();
    });
    $("#lasar").change(function () {
        valdLasar = $(this).children("option:selected").val();
    });
    $("#period").change(function () {
        valdPeriod = $(this).children("option:selected").val();
    });
});

var courseGradeLow = 0;
var courseGradeHigh = 5;
$("#slider").slider({
    range: true,
    min: 0,
    max: 5,
    values: [courseGradeLow, couseGradeHigh],
    slide: (event, ui) => {
        courseGradeLow = ui.values[0];
        courseGradeHigh = ui.values[1];
    }
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
            console.log(data);

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
        if (data[kurs].startvecka) {
            var years = getYears(data[kurs].startvecka);
            var periods = getPeriods(data[kurs].startvecka);
        } else {
            let nrOfYears = Math.floor(Math.random() * 5) + 1;
            var startvecka = [];
            for (let i = 0; i < nrOfYears; i++) {
                let year = 201500 + (Math.floor(Math.random() * 3) * 100);
                let week = Math.floor(Math.random() * 52);
                startWeek = year + week;
                startvecka.push(startWeek + '');
            }
            var years = getYears(startvecka);
            var periods = getPeriods(startvecka);
        }
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
var superID = 0;
function createRow(kurskod, namn, years, periods) {
    console.log(kurskod, namn, years, periods);

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
    period.setAttribute('class', 'grey center period');

    if (periods.length > 1) {
        var selectPeriod = document.createElement('select');
        selectPeriod.setAttribute('class', 'grey');
        selectPeriod.setAttribute('onchange', 'updateRow('+superID+',"'+kortNamn+'")');
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
    year.setAttribute('class', 'white center year');

    if (years.length > 1) {
        var selectYear = document.createElement('select');
        selectYear.setAttribute('onchange', 'updateRow('+superID+',"'+kortNamn+'")');
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
    svar.setAttribute('id', 'svar'+superID);
    svar.setAttribute('class', 'grey center svar');
    svar.innerHTML = Math.floor(Math.random() * 100) + '%';
    tr.appendChild(svar);

    var ok = true;

    var kursvard = document.createElement('td');
    kursvard.setAttribute('id', 'kursvard'+superID);
    var kursvardSaknas = Math.random() < 0.3;
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
    kursrapport.setAttribute('id', 'kursrapport'+superID);
    var kursrapportSaknas = Math.random() < 0.3;
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
    kursomdome.setAttribute('id', 'kursomdome'+superID);
    var kursomdometSaknas = Math.random() < 0.2;
    let omdome = 0;
    if (kursomdometSaknas) {
        kursomdome.innerHTML = 'Saknas';
        kursomdome.setAttribute('class', 'saknas-light center');
    } else {
        omdome = Math.floor(Math.random() * 50) / 10;
        kursomdome.innerHTML = omdome;
        if (omdome < 2) kursomdome.setAttribute('class', 'warning center white');
        else if (omdome >= 4) kursomdome.setAttribute('class', 'good center white');
        else kursomdome.setAttribute('class', 'center white');
    }
    if (omdome > courseGradeHigh || omdome < courseGradeLow) {
        ok = false;
        console.log(omdome, courseGradeLow, courseGradeHigh);
    }
    tr.appendChild(kursomdome);

    var godkandAndel = document.createElement('td');
    godkandAndel.setAttribute('id', 'godkandAndel'+superID);
    var godkandAndelSaknas = Math.random() < 0.2;
    if (godkandAndelSaknas) {
        godkandAndel.innerHTML = 'Saknas';
        godkandAndel.setAttribute('class', 'saknas center godkandAndel');
    } else {
        godkandAndel.innerHTML = Math.floor(Math.random() * 100) + '%';
        godkandAndel.setAttribute('class', 'grey center godkandAndel');
    }
    tr.appendChild(godkandAndel);

    var taggar = document.createElement('td');
    taggar.setAttribute('id', 'taggar'+superID);
    taggar.setAttribute('class', 'white taggar');
    
    let r = Math.random();
    var antalTaggar = 0;
    if (r > 0.8) antalTaggar = 2;
    else if (r > 0.4) antalTaggar = 1;
    var firstColor = 'none';
    var secondColor = 'none';
    for (let i=0; i<antalTaggar; i++) {
        let color = taggColor[Math.floor(Math.random()*6)];
        while (color == firstColor) {
            color = taggColor[Math.floor(Math.random()*6)];
        }
        var tagg = document.createElement('div');
        tagg.setAttribute('style', 'background:'+color);
        tagg.setAttribute('class', 'tagg');
        taggar.appendChild(tagg);
        if (firstColor == 'none')
            firstColor = color;
        else
            secondColor = color;
    }
    if (filterTagg) {
        var filterOk = false;
        for (let i=0; i<6; i++) {
            if (pressedTaggar[i] == 1) {
                if (firstColor == taggColor[i] || secondColor == taggColor[i])
                    filterOk = true;
            }
        }
        if (filterOk == false) {
            ok = false;
        }
    }

    if (globalAdmin) {
        var redigera = document.createElement('a');
        redigera.setAttribute('class', 'redigera');
        redigera.innerHTML = 'redigera';
        redigera.setAttribute('onclick', "navigateAdmin('" + kurskod + "','" + namn + "')");
        taggar.appendChild(redigera);
    }
    tr.appendChild(taggar);

    if (ok) {
        tbody.appendChild(tr);
        var spacer = document.createElement('tr');
        spacer.setAttribute('class', 'spacer');
        tbody.appendChild(spacer);
        superID++;
    }
}

function navigate(kurskod, namn) {
    localStorage.setItem("kursnamn", namn);
    localStorage.setItem("kurskod", kurskod);
    window.location.href = '/kurs?=' + kurskod;
}

function navigateAdmin(kurskod, namn) {
    localStorage.setItem("kursnamn", namn);
    localStorage.setItem("kurskod", kurskod);
    window.location.href = '/admin?=' + kurskod;
}

var moreORless = -1;
function doAvancerat() {
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

var taggColor = ['#39f', '#0fc', '#93f', '#9f3', '#f39', '#f93'];
var pressedTaggar = [0,0,0,0,0,0];
var filterTagg = false;
function doTagg(obj, c) {
    let color = taggColor[c] + "5";
    if (pressedTaggar[c] == 0) {
        pressedTaggar[c] = 1;
        $(obj).css("background", color);
    } else {
        pressedTaggar[c] = 0;
        $(obj).css("background", "");
    }
    filterTagg = false;
    for (let i=0; i<6; i++) {
        if (pressedTaggar[i] == 1)
            filterTagg = true;
    }
}

function updateRow(id, kortNamn) {
    $("#svar"+id).html(Math.floor(Math.random() * 100) + '%');
    var kursvardSaknas = Math.random() < 0.3;
    if (kursvardSaknas) {
        $("#kursvard"+id).html('Saknas');
        $("#kursvard"+id).addClass('saknas-light');
    } else {
        $("#kursvard"+id).html('<a href="http://mingodamat.se">Kursvärd_' + kortNamn + '.pdf</a>');
        $("#kursvard"+id).removeClass('saknas-light');
    }
    var kursrapportSaknas = Math.random() < 0.3;
    if (kursrapportSaknas) {
        $("#kursrapport"+id).html('Saknas');
        $("#kursrapport"+id).addClass('saknas');
        $("#kursrapport"+id).removeClass('grey');
    } else {
        $("#kursrapport"+id).html('<a href="http://mingodamat.se">Kursrapport_' + kortNamn + '.pdf</a>');
        $("#kursrapport"+id).removeClass('saknas');
        $("#kursrapport"+id).addClass('grey');
    }
    var kursomdometSaknas = Math.random() < 0.2;
    let omdome = 0;
    if (kursomdometSaknas) {
        $("#kursomdome"+id).html('Saknas');
        $("#kursomdome"+id).removeClass('warning good white');
        $("#kursomdome"+id).addClass('saknas-light center');
    } else {
        omdome = Math.floor(Math.random() * 50) / 10;
        $("#kursomdome"+id).html(omdome);
        $("#kursomdome"+id).removeClass('warning good saknas-light');

        if (omdome < 2) $("#kursomdome"+id).addClass('warning center white');
        else if (omdome >= 4) $("#kursomdome"+id).addClass('good center white');
        else $("#kursomdome"+id).addClass('center white');
    }
    var godkandAndelSaknas = Math.random() < 0.2;
    if (godkandAndelSaknas) {
        $("#godkandAndel"+id).html('Saknas');
        $("#godkandAndel"+id).addClass('saknas center godkandAndel');
        $("#godkandAndel"+id).removeClass('grey');
    } else {
        $("#godkandAndel"+id).html(Math.floor(Math.random() * 100) + '%');
        $("#godkandAndel"+id).addClass('grey center godkandAndel');
        $("#godkandAndel"+id).removeClass('saknas');
    }
    let onclick = $("#taggar"+id + " a").attr("onclick");
    var taggar = document.getElementById("taggar"+id);
    taggar.innerHTML = "";
    let r = Math.random();
    var antalTaggar = 0;
    if (r > 0.8) antalTaggar = 2;
    else if (r > 0.4) antalTaggar = 1;
    var firstColor = 'none';
    for (let i=0; i<antalTaggar; i++) {
        let color = taggColor[Math.floor(Math.random()*6)];
        while (color == firstColor) {
            color = taggColor[Math.floor(Math.random()*6)];
        }
        var tagg = document.createElement('div');
        tagg.setAttribute('style', 'background:'+color);
        tagg.setAttribute('class', 'tagg');
        taggar.appendChild(tagg);
        if (firstColor == 'none')
            firstColor = color;
    }
    if (globalAdmin) {
        var redigera = document.createElement('a');
        redigera.setAttribute('class', 'redigera');
        redigera.innerHTML = 'redigera';
        redigera.setAttribute('onclick', onclick);
        taggar.appendChild(redigera);
    }
}