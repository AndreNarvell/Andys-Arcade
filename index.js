//Confirmation för exit knapp
var elems = document.getElementsByClassName('confirmation');
    var confirmIt = function (e) {
        if (!confirm('Do you want to terminate the program?')) e.preventDefault();
    };
    for (var i = 0, l = elems.length; i < l; i++) {
        elems[i].addEventListener('click', confirmIt, false);
    }

    