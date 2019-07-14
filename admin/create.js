//Global variables
var isCreation = false;
var userId;
var DBUrl = "https://serverhistrep.herokuapp.com";

$(document).ready(function() {
    $("#loading").hide();

    $("#home").click(function (){
        window.location.href = "http://lanzar-uniovi.es/admin/index.html"
    });

    /**
     * Obtain params from the url in order to know if
     * it is a admin creation or update.
     */
    obtainParam();

    $('[data-toggle="tooltip"]').tooltip();   

    /**
     * When the form is submitted, save the admin and show
     * loading spinner.
     */
    $("#createForm").submit(function(event) {
        event.preventDefault();
        saveAdmin();
        $("#loading").show();
    });

    $("#cancelBtn").click(function (){
        window.location.href = "http://lanzar-uniovi.es/admin/index.html"
    });
});

/**
 * This function search for a parameter in the url. If there are not
 * parameters, is an admin creation. Otherwise, is an admin update.
 */
function obtainParam() {
    var urlparams = window.location.search.substring(1).split('&');
    if (urlparams[0] == "") {
        this.isCreation = true;
    } else {
        $("h2").text("Edit account");
        this.userId = localStorage.getItem('id');
        this.isCreation = false;
        obtainUser(this.userId);
    }
}

/**
 * This function call the server and obtain all the data of
 * the admin.
 * @param {long} id 
 */
function obtainUser(id) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: DBUrl+"/adminId/"+id
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            window.location.href = "http://lanzar-uniovi.es/admin/index.html"
        } else {
            console.log(data[0]);
            completeForm(data[0]);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        window.location.href = "http://lanzar-uniovi.es/admin/index.html"
    });
}

/**
 * This function complete the form with the data of the admin.
 * @param {list} user 
 */
function completeForm(user) {
    $("#nameForm").val(user.name);
    $("#lastnameForm").val(user.lastName);
    $("#emailForm").val(user.email);
}

/**
 * This function call the service and add or update the admin.
 */
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