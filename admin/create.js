//Global variables
var isCreation = false;
var userId;

$(document).ready(function() {

    obtainParam();

    $('[data-toggle="tooltip"]').tooltip();   

    $("#createForm").submit(function(event) {
        event.preventDefault();
        saveAdmin();
    });

    $("#cancelBtn").click(function (){
        window.location.href = "http://127.0.0.1:5500/index.html"
    });
});

function obtainParam() {
    console.log( window.location.search.substring(1));
    var urlparams = window.location.search.substring(1).split('&');
    if (urlparams[0] == "") {
        this.isCreation = true;
    } else {
        console.log("Editing user");
        this.userId = localStorage.getItem('id');
        this.isCreation = false;
        obtainUser(this.userId);
    }
}

function obtainUser(id) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://192.168.1.33:8080/adminId/"+id
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            console.log("ERROR");
        } else {
            console.log(data[0]);
            completeForm(data[0]);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("Error when trying to obtain user.");
    });
}

function completeForm(user) {
    $("#nameForm").val(user.name);
    $("#lastnameForm").val(user.lastName);
    $("#emailForm").val(user.email);
}

function saveAdmin() {
    console.log("Saving admin.");
    var url;
    if (this.isCreation) {
        url = "http://192.168.1.33:8080/admin/add";
    } else {
        url = "http://192.168.1.33:8080/admin/update/"+this.userId;
    }

    $.ajax({
        type: "POST",
        data: $("#createForm").serialize(),
        url: url
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            $("#alert").show();
        } else {
            console.log(data[0]);
            $("#alert").hide();
            window.location.href = "http://127.0.0.1:5500/index.html"
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        $("#alert").show();
    });
}