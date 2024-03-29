//Global variables
var representationid;
var Url1 = "http://maps.googleapis.com/maps/api/staticmap?center=";
var Url2 = "&markers=color:blue%7Clabel:You%7C";
var Url3 = "&zoom=17&size=400x500&maptype=terrain&key=AIzaSyDIhY8U0bDAtyYyJw-iuIBI2a1KPWbYMJE";
var key = "&key=AIzaSyDIhY8U0bDAtyYyJw-iuIBI2a1KPWbYMJE";
var DBUrl = "https://serverhistrep.herokuapp.com";

$(document).ready(function() {
    $("#contentContainer").hide();
    obtainParam();
    obtainRepresentation();

    $("#home").click(function (){
        window.location.href = "http://lanzar-uniovi.es/admin/index.html"
    });
});

/**
 * This functions obtains the url params. The second param is assigned
 * to the representation id.
 */
function obtainParam() {
    var urlparams = window.location.search.substring(1).split('&');
    var user = localStorage.getItem('id');
    if (!user || urlparams[0] == "")  {
        window.location.href = "http://lanzar-uniovi.es/admin/index.html";
    }

    this.representationid = urlparams[0].split('=')[1];
}

/**
 * This function calls the server and obtain the data of the
 * representation.
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
            completePage(data[0]);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        window.location.href = "http://lanzar-uniovi.es/admin/index.html";
    });
}

/**
 * This function update the HTML with the data of the
 * representation.
 * @param {list} rep 
 */
function completePage(rep) {
    $("#title").html(rep.title);
    $("#description").html(rep.description);
    $("#history").click(function (){
        $("#content").empty();
        $("#content").html("<p>"+rep.history+"</p>");
    });
    $("#interest").click(function (){
        $("#content").empty();
        $("#content").html("<p>"+rep.interestInfo+"</p>");
    });
    $("#technical").click(function (){
        $("#content").empty();
        $("#content").html("<p>"+rep.technicalInfo+"</p>");
    });
    $("#location").click(function (){
        $("#content").empty();
        $("#content").html('<img height="500" width="423" src="'+Url1+rep.latitude+","+rep.longitude+Url2
            +rep.latitude+","+rep.longitude+Url3+key+'">');
    });
    $("#representation").click(function (){
        $("#content").empty();
        $("#content").html('<video controls>'+
            '<source src="https://serverhistrep.herokuapp.com/videos/rep-'+rep.id+'.mp4" type="video/mp4"></video>');
    });
    $("#representationImage").click(function (){
        $("#content").empty();
        $("#content").html('<img height="500" width="423" src="https://serverhistrep.herokuapp.com/images/img-'+rep.id+'.jpg">');
    });

    $("#historyForm").html(rep.history);
    $("#interestForm").html(rep.interestInfo);
    $("#technicalForm").html(rep.technicalInfo);
    $("#latitudeForm").val(rep.latitude);
    $("#longitudeForm").val(rep.longitude);
}
