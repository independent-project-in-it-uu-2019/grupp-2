
// Check if user is logged in
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user);
        window.location = '/';
    } else {
        console.log('No user is logged in');
    }
});

function login() {
    var username = $('.username').val();
    var password = $('.password').val();

    console.log(username, password);

    firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        alert(errorMessage);
    });
}

$('body').keypress(function (e) {
    var key = e.which;
    if (key == 13) {
        login();
    }
});