var SERVER_URL = 'http://localhost:8142';

function saveData() {
    if (validateUniversityInfo()) {
        var university = {
            name: $("#name").val(),
            address: $("#address"),
            phone: $("#phone").val()
        };
        $.post(SERVER_URL + "/saveuniversity", university,
            function (data) {
                alert("Data Submitted" + data);
            }).fail(function (error) {
                alert("Error: " + error.responseText);
            });
    }
}

function validateUnversityInfo() {
    var name = $("#name").val().replace(/^\s+|\s+$/g, "");
    var address = $("#address").val().replace(/^\s+|\s+$/g, "");
    var phone = $("#phone").val().replace(/^\s+|\s+$/g, "");
    if (!name) {
        alert("Please Enter University Name");
        $("#name").focus();
        return false;
    }

    if (!address) {
        alert("Please Enter University Address");
        $("#address").focus();
        return false;
    }

    if (!phone) {
        alert("Please Enter University Phone number");
        $("#phone").focus();
        return false;
    }
    var firstChar = address.trim().substr(0, 1);
    if (isNaN(firstChar)) {
        alert("Address should start with a number!");
        $("#address").focus();
        return false;
    }
    var tokens = phone.split('-');
    for (var i = 0; i < tokens.length; i++) {
        if (isNaN(tokens[i])) {
            alert("Please use only numbers or hyphens!");
            $("#phone").focus();
            return false;
        }
    }
    var pattern = /[a-z]/i;
    if (!(pattern.test(address))) {
        alert("Address should contain letters!");
        $("#address").focus();
        return false;
    }
    return true;
}

function searchInfo() {
    var universityName = $("#search").val().replace(/^\s+|\s+$/g, "");
    if (universityName == '') {
        alert("Please enter the name of searching university!");
        $("#search").focus();
        return false;
    }
    $.get(SERVER_URL + '/find/' + universityName, function (data) {
        if (data.length > 0) {
            display(data);
        } else {
            alert("No university named " + universityName + " in database.");
        }

    })
        .fail(function (error) {
            alert("Error: " + error.responseText);
        });

}

function deleteInformation() {
    if (validateUniversityInfo()) {
        var university = {
            name: $("#name").val().replace(/^\s+|\s+$/g, ""),
            address: $("#address").val().replace(/^\s+|\s+$/g, ""),
            phone: $("#phone").val().replace(/^\s+|\s+$/g, "")
        };
        var key = $('#name').val().replace(/^\s+|\s+$/g, "");
        $.post(SERVER_URL + '/delete/' + key, university, function (data) {
            alert(data);
        })
            .fail(function (error) {
                alert("Error: " + error.responseText);
            });
    }

}

function displayRecords() {
    $.get(SERVER_URL + '/queryuniversitylist', function (data) {
        display(data);
    })
        .fail(function (error) {
            alert("Error: " + error.responseText);
        });
}

function display(universities) {
    $("#displayTable").html(
        "   <tr>" +
        "     <th>Name</th>" +
        "     <th>Address</th>" +
        "     <th>Phone</th>" +
        "   </tr>"
    );
    var table = document.getElementById('displayTable');
    for (var i = 0; i < universities.length; i++) {

        var name = universities[i].name;
        var address = universities[i].address;
        var phone = universities[i].phone;

        var r = table.insertRow();
        r.insertCell(-1).innerHTML = name;
        r.insertCell(-1).innerHTML = address;
        r.insertCell(-1).innerHTML = phone;

    }
}