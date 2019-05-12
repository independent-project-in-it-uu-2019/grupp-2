// Check if user is logged in
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user);
        $('.user').text(user.email);
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