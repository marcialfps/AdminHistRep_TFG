//VARIABLES
var userid;
var postid;
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
            savePost("PUT", $("#titleForm").val(), $("#bodyForm").html(), postid);
        } else {
            savePost("POST", $("#titleForm").val(), $("#bodyForm").html(), "");
        }
    });
});

function obtainParam(progressbar) {
    var urlparams = window.location.search.substring(1).split('&');
    console.log(urlparams)
    if (urlparams[0] == "") window.location.href = "http://127.0.0.1:5500/index.html"
    userid = urlparams[0].split('=')[1];
    postid = urlparams[1].split('=')[1];

    if (postid == "-1") {
        isEdition = false;
    } else {
        editionMode(progressbar);
    }

    progressbar.progressbar( "value", value + 25 );
    value += 25;
    obtainUser(progressbar, userid);
}

function editionMode(progressbar) {
    obtainPost(progressbar, postid);
}

function obtainUser(progressbar, id) {
    $.ajax({
        data: {"id": id},
        type: "GET",
        dataType: "json",
        url: "https://jsonplaceholder.typicode.com/users"
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            console.log("The user does not exist");
        } else {
            if (progressbar != null) progressbar.progressbar( "value", value + 25 );
            value += 25;
            $("#userMessage").html("Welcome, " + data[0].name);
            $("#administration").attr("href", "http://127.0.0.1:5500/backoffice/backoffice.html?" + userid);
            $("#cancelBtn").attr("onclick", 'location.href="http://127.0.0.1:5500/backoffice/backoffice.html?'+userid+'"');
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("error...");
    });
}

function obtainPost(progressbar, id) {
    $.ajax({
        data: {"id": id},
        type: "GET",
        dataType: "json",
        url: "https://jsonplaceholder.typicode.com/posts"
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

function savePost(method, title, body, postid) {
    $.ajax({
        type: method,
        data: {"userId": userid, "id": this.postid, "title":  title, "body": body},
        url: "https://jsonplaceholder.typicode.com/posts/"+postid
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            $("#alert").show();
        } else {
            $("#alert").hide();
            window.location.href="http://127.0.0.1:5500/backoffice/backoffice.html?"+userid;
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        $("#alert").show();
    });
}

function completeForm(post) {
    $("#titleForm").val(post.title);
    $("#bodyForm").html(post.body);
}
