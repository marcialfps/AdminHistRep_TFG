//Global variables
var email;
var user;
var DBUrl = "https://serverhistrep.herokuapp.com";

$(document).ready(function() {
    //var remember_check = false;

    $("#representationsCard").hide();
    $("#logoutAdmin").hide();

    $( "#dialog-confirm" ).dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true
      });

    if (localStorage.getItem('id')) {
        $("#loginCard").hide();
        obtainRepresentations(localStorage.getItem('id'));
    }

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
            url: DBUrl+"/admin/login"
        })
        .done(function(data, textStatus, jqXHR) {
            console.log(data);
            if(data.toString() == "false") { //Not existing user
                console.log("The user does not exist");
                $("#alert").show();
            } else {
                console.log("Login the user "+ $("#emailForm").val())
                $("#alert").hide();
                obtainUser($("#emailForm").val());
                
                $("#loginCard").hide();
                this.user = data;
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            alert("Error when trying to login.");
        })
    });

    /*
    $("#remember").click(function() {
        if(!remember_check) {
            $("#alertInfo").show();
            remember_check = true;
        } else {
            $("#alertInfo").hide();
            remember_check = false;
        }
    });
    */

    $("#logoutAdmin").click(function() {
        localStorage.removeItem('id');
        $("#loginCard").show();
        $("#representationsCard").hide();
        $("#logoutAdmin").hide();
    });
});

function obtainUser(email) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: DBUrl+"/admin/"+email
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            console.log("ERROR");
        } else {
            console.log(data[0]);
            this.user = data[0];
            // Store it in the local storage
            localStorage.setItem('id', data[0].id);
            obtainRepresentations(data[0].id);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("Error when trying to obtain user.");
    });
}

function obtainRepresentations(user) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: DBUrl+"/representations"
    })
    .done(function(data, textStatus, jqXHR) {
        showRepresentations(data, user);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("Erro when trying to obtain representations.");
    });
}

function showRepresentations(data, user) {
    console.log(user);
    $("#listRepresentations").empty();

    $.each(data, function(index, rep) {
        $("#listRepresentations").append('<tr><td>'+rep.title+'</td>'+
        '<td><button type="button" class="btn btn-primary mr-2" id="info-'+rep.id+'"><img class="icon-img" src="../img/info_icon.png"></button>'+
        '<button type="button" class="btn btn-info btn-edit mr-2" id="edit-'+rep.id+'"><img class="icon-img" src="../img/edit_icon.png"></button>'+
        '<button type="button" class="btn btn-danger mr-2" id="delete-'+rep.id+'"><img class="icon-img" src="../img/delete_icon.png"></button></td></tr>');

        $("#info-"+rep.id).attr("onclick", 'location.href="http://127.0.0.1:5500/information/info.html?post='+rep.id+'"');
        $("#edit-"+rep.id).attr("onclick", 'location.href="http://127.0.0.1:5500/edition/edition.html?post='+rep.id+'"');
        $("#delete-"+rep.id).click(function() {
            $( "#dialog-confirm" ).dialog({
                buttons: {
                    "Confirm": function() {
                        deleteRepresentation(rep.id, user.id);   
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

    $("#btnAdd").attr("onclick", 'location.href="http://127.0.0.1:5500/edition/edition.html?post=-1"');
    $("#addAdmin").attr("onclick", 'location.href="http://127.0.0.1:5500/admin/create.html"');
    $("#editAdmin").attr("onclick", 'location.href="http://127.0.0.1:5500/admin/create.html?edit"');
    $("#representationsCard").show();
    $("#logoutAdmin").show();
}

function deleteRepresentation(id) {
    var user = localStorage.getItem('id');
    console.log("Trying to remove representation "+id);
    $.ajax({
        type: "GET",
        dataType: "text",
        url: DBUrl+"/representation/delete/"+id
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0 || data.toString() == "Error") { //Not existing user
            console.log("ERROR");
        } else {
            obtainRepresentations(user.id);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("error...");
    });
}