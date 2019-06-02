var server = io();

var selectedCourse = undefined;
var searchResults = undefined;

var valdProgramkod = "alla";
var valdLasar = "alla";
var valdPeriod = "alla";
var noKursrapport = false;
var noKursvardering = false;

var showResults = false;

$(document).ready(() => {
    if (selectedCourse) {
        $(".form").css('display', 'block');
        $("#courseTitle").html(selectedCourse);
    }
    makeTags();
});

$('body').keypress(e => {
    if (e.which == 13) {
        searchCourse();
    }
});

function searchCourse() {
    var modal = document.getElementById("modal");
    let text = $('#searchBox').val();

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
            $(".search-results-wrapper").css('display', 'block');

            if (data != null) {
                displayCourses(data);
            } else {
                alert('Inga resultat!');
            }
        });
    }
}

function toggleResults(close) {
    
    if (close) {
        selectedCourse = undefined;
        $(".form").css('display', 'none');
        $("#courseTitle").html('');
    }
    

    if (!showResults) {
        $(".search-results").css('max-height', '482px');
        $("#toggle").html('Göm sökresultat');
        $("#moreORless").css("transform", "rotate(-180deg)");
    } else {
        $(".search-results").css('max-height', '0px');
        $("#toggle").html('Visa sökresultat');
        $("#moreORless").css("transform", "rotate(0deg)");
    }
    showResults = !showResults;
}

function displayCourses(data) {
    var searchResultsElement = $(".search-results");
    searchResultsElement.html('');

    searchResults = data;

    for (course in data) {
        let courseName = '<b>' + course + '</b>' + ' - ' + data[course].namn;
        let p = document.createElement('p');
        p.innerHTML = courseName;
        p.setAttribute('onclick', 'selectCourse("' + course + '")');
        searchResultsElement.append(p);
    }

    if (!showResults) toggleResults();
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

function selectCourse(course) {
    selectedCourse = searchResults[course].namn;
    $(".form").css('display', 'block');
    $("#courseTitle").html(course + ' - ' + selectedCourse);

    toggleResults();

    if (searchResults[course].startvecka) {
        var years = getYears(searchResults[course].startvecka);
        var periods = getPeriods(searchResults[course].startvecka);
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

    var selectPeriod = document.getElementById('period');
    for (let i = 0; i < periods.length; i++) {
        let o = document.createElement('option');
        o.setAttribute('value', periods[i]);
        o.innerHTML = periods[i];
        selectPeriod.appendChild(o);
    }

    var selectYear = document.getElementById('year');
    for (let i = 0; i < years.length; i++) {
        let o = document.createElement('option');
        o.setAttribute('value', years[i]);
        o.innerHTML = years[i];
        selectYear.appendChild(o);
    }
}

var availableTags = [
    'Studium',
    'Hemtenta',
    'Flipped classroom',
    'Socrative',
    'Annan tagg',
    'Bla bla bla',
    'Morötter',
    'Bananer',
    'Brandbilar',
    'Delfiner',
    'Maskrosor',
    'Fotbollar',
    'Kottar'
];

var selectedTags = [];
function makeTags() {
    var availableTagsDiv = document.getElementById('available-tags');
    $('#available-tags').html('');

    for (let i = 0; i < availableTags.length; i++) {
        let tag = document.createElement('span');
        tag.setAttribute('class', 'tag');
        tag.innerHTML = availableTags[i];
        tag.setAttribute('onclick', 'moveTag("' + availableTags[i] + '")');

        let img = document.createElement('img');
        img.setAttribute('src', 'img/+_green.png');

        tag.appendChild(img);
        availableTagsDiv.appendChild(tag);
    }

    var selectedTagsDiv = document.getElementById('selected-tags');
    $('#selected-tags').html('');

    for (let i = 0; i < selectedTags.length; i++) {
        let tag = document.createElement('span');
        tag.setAttribute('class', 'tag');
        tag.innerHTML = selectedTags[i];
        tag.setAttribute('onclick', 'moveTag("' + selectedTags[i] + '")');

        let img = document.createElement('img');
        img.setAttribute('src', 'img/x_red.png');

        tag.appendChild(img);
        selectedTagsDiv.appendChild(tag);
    }
}

function moveTag(tag) {
    if (availableTags.includes(tag)) {
        availableTags.map((t, i) => {
            if (t == tag) {
                availableTags.splice(i, 1);
                selectedTags.push(tag);
            }
        });
    } else {
        selectedTags.map((t, i) => {
            if (t == tag) {
                selectedTags.splice(i, 1);
                availableTags.push(tag);
            }
        });
    }
    makeTags();
}

function clearAllTags() {
    selectedTags.map(t => {
        availableTags.push(t);
    });
    selectedTags = [];
    makeTags();
}

function save() {
    alert('Sparat!');
    location.reload();
}