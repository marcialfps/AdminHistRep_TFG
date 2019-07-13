//Global variables
var isCreation = false;
var userId;
var DBUrl = "https://serverhistrep.herokuapp.com";

$(document).ready(function() {
    $("#loading").hide();

    $("#home").click(function (){
        window.location.href = "http://lanzar-uniovi.es/admin/index.html"
    });

    obtainParam();

    $('[data-toggle="tooltip"]').tooltip();   

    $("#createForm").submit(function(event) {
        event.preventDefault();
        saveAdmin();
        $("#loading").show();
    });

    $("#cancelBtn").click(function (){
        window.location.href = "http://lanzar-uniovi.es/admin/index.html"
    });
});

function obtainParam() {
    console.log( window.location.search.substring(1));
    var urlparams = window.location.search.substring(1).split('&');
    if (urlparams[0] == "") {
        this.isCreation = true;
    } else {
        console.log("Editing user");
        $("#title").val("Edit account");
        this.userId = localStorage.getItem('id');
        this.isCreation = false;
        obtainUser(this.userId);
    }
}

function obtainUser(id) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: DBUrl+"/adminId/"+id
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
        url = DBUrl+"/admin/add";
    } else {
        url = DBUrl+"/admin/update/"+this.userId;
    }

    $.ajax({
        type: "POST",
        data: $("#createForm").serialize(),
        url: url
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            $("#alert").show();
            $("#loading").hide();
        } else {
            console.log(data[0]);
            $("#alert").hide();
            $("#loading").hide();
            window.location.href = "http://lanzar-uniovi.es/admin/index.html"
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        $("#alert").show();
        $("#loading").hide();
    });
}