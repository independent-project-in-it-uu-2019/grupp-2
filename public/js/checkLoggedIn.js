// Check if user is logged in

var globalAdmin = false;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        //console.log(user);
        $('.user').text(user.email);
        if (user.email == 'studierektor@email.se') {
            globalAdmin = true;
        } else {
            $('.rektor').css('display', 'none');
            $('.student').css('width', '33%');
            $('.edit').css('display', 'none');
            $('.upload').css('display', 'none');
        }
    } else {
        window.location = '/login';
    }
});

function logout() {
    firebase.auth().signOut().then(function () {
        window.location = '/login';
    }).catch(function (error) {
        console.log(error.message);
    });
}