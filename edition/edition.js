//VARIABLES
var userid;
var representationid;
var value = 0;
var isEdition = false;

$(document).ready(function() {

    var progressbar = $( "#progressbar" ),
        progressLabel = $( ".progress-label" );
    

    progressbar.progressbar({
        value: false,
        change: function() {
        progressLabel.text( progressbar.progressbar( "value" ) + "%" );
        }
    });

    $('[data-toggle="tooltip"]').tooltip();   

    obtainParam(progressbar);
    

    $("#updateForm").submit(function(event) {
        event.preventDefault();
        if (isEdition) {
            saveRepresentation("update");
        } else {
            //savePost("POST", $("#titleForm").val(), $("#bodyForm").html(), "");
        }
    });

    $("#cancelBtn").click(function (){
        window.history.back();
    });
});

function obtainParam(progressbar) {
    var urlparams = window.location.search.substring(1).split('&');
    console.log(urlparams)
    if (urlparams[0] == "") window.location.href = "http://127.0.0.1:5500/index.html"
    this.userid = urlparams[0].split('=')[1];
    this.representationid = urlparams[1].split('=')[1];

    if (this.representationid == "-1") {
        isEdition = false;
    } else {
        isEdition = true;
        editionMode(progressbar);
    }

    progressbar.progressbar( "value", value + 25 );
    value += 25;
}

function editionMode(progressbar) {
    obtainRepresentation(progressbar);
}

function obtainRepresentation(progressbar) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://192.168.1.33:8080/representation/"+this.representationid
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            console.log("ERROR");
        } else {
            progressbar.progressbar( "value", value + 50 );
            value += 50;
            completeForm(data[0]);
            progressbar.hide();
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("error...");
    });
}

function saveRepresentation(route) {
    console.log("Saving representation.");

    $.ajax({
        type: "POST",
        data: $("#updateForm").serialize(),
        url: "http://192.168.1.33:8080/representation/"+route+"/"+this.representationid
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            $("#alert").show();
        } else {
            $("#alert").hide();
            var fd = new FormData();
            fd.append("file", representationForm.files[0]);
            console.log(representationForm.files[0]);
            $.ajax({
                type: "POST",
                data: fd,
                cache: false,
                contentType: false,
                processData: false,
                url: "http://192.168.1.33:8080/representation/loadMultimedia/"+representationid
                })
                .done(function(data, textStatus, jqXHR) {
                    if(data.length <= 0) { //Not existing user
                        $("#alert").show();
                    } else {
                        $("#alert").hide();
                        window.history.back();
                    }
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    $("#alert").show();
                });
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
