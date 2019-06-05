//Global variables
var user;

$(document).ready(function() {
    var remember_check = false;

    $( "#dialog-confirm" ).dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true
      });

    /**
     * This function call the service and obtain the user that
     * corresponds to the email introduced. If the service doesnt 
     * return a user, it doesnt exist.
     */
    $("#loginForm").submit(function(event) {
        event.preventDefault();
        $.ajax({
            data: $(this).serialize(),
            type: "POST",
            url: "http://192.168.1.33:8080/admin/login"
        })
        .done(function(data, textStatus, jqXHR) {
            console.log(data.toString());
            if(data.length <= 0 || data.toString() == "false") { //Not existing user
                console.log("The user does not exist");
                $("#alert").show();
            } else {
                console.log("Login the user "+ $("#emailForm").val())
                $("#alert").hide();
                obtainRepresentations();
                $("#loginCard").hide();
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            alert("error...");
        })
    });

    $("#remember").click(function() {
        console.log(remember_check);
        if(!remember_check) {
            $("#alertInfo").show();
            remember_check = true;
        } else {
            $("#alertInfo").hide();
            remember_check = false;
        }
    });
});

function obtainRepresentations() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://192.168.1.33:8080/representations"
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            console.log("ERROR");
        } else {
            console.log(data);
            showRepresentations(data);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("error...");
    });
}

function showRepresentations(data) {
    $("#listRepresentations").empty();

    $.each(data, function(index, rep) {
        $("#listRepresentations").append('<tr><td>'+rep.title+'</td>'+
        '<td><button type="button" class="btn btn-primary" id="info-'+rep.id+'"><img class="icon-img" src="../img/info_icon.png"></button>'+
        '<button type="button" class="btn btn-info" id="edit-'+rep.id+'"><img class="icon-img" src="../img/edit_icon.png"></button>'+
        '<button type="button" class="btn btn-danger" id="delete-'+rep.id+'"><img class="icon-img" src="../img/delete_icon.png"></button></td></tr>');

        $("#info-"+rep.id).attr("onclick", 'location.href="http://127.0.0.1:5500/information/info.html?user='+user+'&post='+rep.id+'"');
        $("#edit-"+rep.id).attr("onclick", 'location.href="http://127.0.0.1:5500/edition/edition.html?user='+user+'&post='+rep.id+'"');
        $("#delete-"+rep.id).click(function() {
            $( "#dialog-confirm" ).dialog({
                buttons: {
                    "Confirm": function() {
                        deleteRepresentation(rep.id);   
                        $( this ).dialog( "close" );            
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                }
              });
            $("#dialog-confirm").dialog("open");
        });
    });
}

function deleteRepresentation(id) {
    console.log("Trying to remove representation "+id);
    $.ajax({
        type: "GET",
        dataType: "text",
        url: "http://192.168.1.33:8080/representation/delete/"+id
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0 || data.toString() == "Error") { //Not existing user
            console.log("ERROR");
        } else {
            obtainRepresentations();
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("error...");
    });
}