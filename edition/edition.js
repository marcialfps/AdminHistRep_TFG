//VARIABLES
var userid;
var representationid;
var isEdition = false;
var DBUrl = "https://serverhistrep.herokuapp.com";

$(document).ready(function() {
    $("#home").click(function (){
        window.location.href = "http://www.lanzar-uniovi.es/admin/index.html"
    });

    $('[data-toggle="tooltip"]').tooltip();   

    obtainParam();
    

    $("#updateForm").submit(function(event) {
        event.preventDefault();
        saveRepresentation();
    });

    $("#cancelBtn").click(function (){
        window.location.href = "http://www.lanzar-uniovi.es/admin/index.html"
    });
});

function obtainParam() {
    var urlparams = window.location.search.substring(1).split('&');
    console.log(urlparams)
    if (urlparams[0] == "") window.location.href = "http://www.lanzar-uniovi.es/admin/index.html";
    var user = localStorage.getItem('id');
    if (!user) window.location.href = "http://www.lanzar-uniovi.es/admin/index.html";
    this.representationid = urlparams[0].split('=')[1];

    if (this.representationid == "-1") {
        isEdition = false;
    } else {
        isEdition = true;
        editionMode();
    }
}

function editionMode() {
    obtainRepresentation();
}

function obtainRepresentation() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: DBUrl+"/representation/"+this.representationid
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            console.log("ERROR");
        } else {
            completeForm(data[0]);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("error...");
    });
}

function saveRepresentation() {
    console.log("Saving representation.");
    var url;
    if(isEdition)
        url = DBUrl+"/representation/update/"+this.representationid;
    else
        url = DBUrl+"/representation/add";

    $.ajax({
        type: "POST",
        data: $("#updateForm").serialize(),
        url: url
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            $("#alert").show();
        } else {
            console.log(data[0]);
            $("#alert").hide();
            saveMultimedia(data[0]);
            saveImage(data[0]);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        $("#alert").show();
    });
}

function saveMultimedia(rep) {
    var fd = new FormData();
    fd.append("file", representationForm.files[0]);
    console.log(representationForm.files[0]);
    $.ajax({
        type: "POST",
        data: fd,
        cache: false,
        contentType: false,
        processData: false,
        async: false,
        url: DBUrl+"/representation/loadMultimedia/"+rep.id
        })
        .done(function(data, textStatus, jqXHR) {
            if(data.length <= 0) { //Not existing user
                $("#alert").show();
            } else {
                $("#alert").hide();
                window.location.href = "http://www.lanzar-uniovi.es/admin/index.html"
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $("#alert").show();
    });
}

function saveImage(rep) {
    var fd = new FormData();
    fd.append("file", representationImageForm.files[0]);
    console.log(representationForm.files[0]);
    $.ajax({
        type: "POST",
        data: fd,
        cache: false,
        contentType: false,
        processData: false,
        async: false,
        url: DBUrl+"/representation/loadMultimedia/"+rep.id
        })
        .done(function(data, textStatus, jqXHR) {
            if(data.length <= 0) { //Not existing user
                $("#alert").show();
            } else {
                $("#alert").hide();
                window.location.href = "http://www.lanzar-uniovi.es/admin/index.html"
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $("#alert").show();
    });
}

function completeForm(rep) {
    $("#titleForm").val(rep.title);
    $("#descriptionForm").html(rep.description);
    $("#historyForm").html(rep.history);
    $("#interestForm").html(rep.interestInfo);
    $("#technicalForm").html(rep.technicalInfo);
    $("#latitudeForm").val(rep.latitude);
    $("#longitudeForm").val(rep.longitude);
}
