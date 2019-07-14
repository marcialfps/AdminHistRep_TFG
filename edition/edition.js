//VARIABLES
var userid;
var representationid;
var isEdition = false;
var DBUrl = "https://serverhistrep.herokuapp.com";

$(document).ready(function() {
    $("#loading").hide();

    $("#home").click(function (){
        window.location.href = "http://lanzar-uniovi.es/admin/index.html"
    });

    $('[data-toggle="tooltip"]').tooltip();   

    /**
     * Obtain the params from the url to know if is representation
     * edition or creation.
     */
    obtainParam();
    
    /**
     * When the form is submitted, the representation is saved.
     */
    $("#updateForm").submit(function(event) {
        event.preventDefault();
        saveRepresentation();
        $("#loading").show();
    });

    $("#cancelBtn").click(function (){
        window.location.href = "http://lanzar-uniovi.es/admin/index.html"
    });
});

/**
 * Obtain the params from the url. If the first param is empty or the 
 * local storage has not the user, reload main page. Also, if the second
 * parameters is -1 it is creation mode.
 */
function obtainParam() {
    var urlparams = window.location.search.substring(1).split('&');
    var user = localStorage.getItem('id');
    if (!user || urlparams[0] == "") {
        window.location.href = "http://lanzar-uniovi.es/admin/index.html";
    }

    this.representationid = urlparams[0].split('=')[1];

    if (this.representationid == "-1") {
        isEdition = false;
    } else {
        isEdition = true;
        obtainRepresentation();
    }
}

/**
 * This function call the server and obtain all the data
 * of the representation.
 */
function obtainRepresentation() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: DBUrl+"/representation/"+this.representationid
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            window.location.href = "http://lanzar-uniovi.es/admin/index.html";
        } else {
            completeForm(data[0]);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        window.location.href = "http://lanzar-uniovi.es/admin/index.html";
    });
}

/**
 * This function call the server and save or update the representation.
 * After that, it tries to load the representation video.
 */
function saveRepresentation() {
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
            $("#alert").hide();
            saveMultimedia(data[0]);   
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        $("#alert").show();
    });
}

/**
 * This function calls the server and send the representation
 * video. After that, it tries to load the representation 
 * image.
 * @param {list} rep 
 */
function saveMultimedia(rep) {
    var fd = new FormData();
    fd.append("file", representationForm.files[0]);
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
                saveImage(data[0]);
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $("#alert").show();
    });
}

/**
 * This function calls the server and send the representation
 * image. When finished, reload the list of representations.
 * @param {list} rep 
 */
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
                $("#loading").hide();
                window.location.href = "http://lanzar-uniovi.es/admin/index.html"
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $("#alert").show();
            $("#loading").hide();
    });
}

/**
 * Complete the form with all the data of the representation.
 * @param {list} rep 
 */
function completeForm(rep) {
    $("#titleForm").val(rep.title);
    $("#descriptionForm").html(rep.description);
    $("#historyForm").html(rep.history);
    $("#interestForm").html(rep.interestInfo);
    $("#technicalForm").html(rep.technicalInfo);
    $("#latitudeForm").val(rep.latitude);
    $("#longitudeForm").val(rep.longitude);
}
