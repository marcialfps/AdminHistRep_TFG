//Global variables
var email;
var user;
var DBUrl = "https://serverhistrep.herokuapp.com";

$(document).ready(function() {
    showLogin();

    $( "#dialog-confirm" ).dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true
      });

    /**
     * If the user has in local storage an item with name
     * 'id', he is logged. So, hide login card and show
     * the list of representations.
     */
    if (localStorage.getItem('id')) {
        $("#loginCard").hide();
        $("#loading").show();
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
                $("#alert").show();
            } else {
                console.log("Login the user "+ $("#emailForm").val())
                $("#alert").hide();
                $("#loading").show();
                obtainUser($("#emailForm").val());
                $("#loginCard").hide();
                this.user = data;
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $("#alert").show();
        })
    });

    /**
     * When user logout, remove the item from local
     * storage, hide all elements used by the user
     * and show login card.
     */
    $("#logoutAdmin").click(function() {
        localStorage.removeItem('id');
        $("#loginCard").show();
        $("#representationsCard").hide();
        $("#logoutAdmin").hide();
        $("#addAdmin").hide();
        $("#editAdmin").hide();
    });
});

/**
 * This function call the server an obtain an user
 * by its email.
 * @param {string} email 
 */
function obtainUser(email) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: DBUrl+"/admin/"+email
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            showLogin();
        } else {
            console.log(data[0]);
            this.user = data[0];
            // Store it in the local storage
            localStorage.setItem('id', data[0].id);
            obtainRepresentations(data[0].id);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        showLogin();
    });
}

/**
 * This function call the server and obtain all
 * the representations.
 * @param {long} user 
 */
function obtainRepresentations(user) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: DBUrl+"/representations"
    })
    .done(function(data, textStatus, jqXHR) {
        showRepresentations(data, user);
        $("#loading").hide();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        showLogin();
    });
}

/**
 * This function add elements to the HTML in order to show
 * all the representations and their buttons.
 * @param {list} data 
 * @param {long} user 
 */
function showRepresentations(data, user) {
    $("#listRepresentations").empty();

    $.each(data, function(index, rep) {
        $("#listRepresentations").append('<tr><td>'+rep.title+'</td>'+
        '<td><button type="button" class="btn btn-primary mr-2" id="info-'+rep.id+'"><img class="icon-img" src="img/info_icon.png"></button>'+
        '<button type="button" class="btn btn-info btn-edit mr-2" id="edit-'+rep.id+'"><img class="icon-img" src="img/edit_icon.png"></button>'+
        '<button type="button" class="btn btn-danger mr-2" id="delete-'+rep.id+'"><img class="icon-img" src="img/delete_icon.png"></button></td></tr>');

        $("#info-"+rep.id).attr("onclick", 
            'location.href="http://lanzar-uniovi.es/admin/information/info.html?post='+rep.id+'"');
        $("#edit-"+rep.id).attr("onclick", 
            'location.href="http://lanzar-uniovi.es/admin/edition/edition.html?post='+rep.id+'"');
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

    $("#btnAdd").attr("onclick", 'location.href="http://lanzar-uniovi.es/admin/edition/edition.html?post=-1"');
    $("#addAdmin").attr("onclick", 'location.href="http://lanzar-uniovi.es/admin/admin/create.html"');
    $("#editAdmin").attr("onclick", 'location.href="http://lanzar-uniovi.es/admin/admin/create.html?edit"');
    showHome();
}

/**
 * This function call the server in order to remove
 * the representation. Next, the list of representations
 * is updated.
 * @param {long} id 
 */
function deleteRepresentation(id) {
    var user = localStorage.getItem('id');
    $.ajax({
        type: "GET",
        dataType: "text",
        url: DBUrl+"/representation/delete/"+id
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0 || data.toString() == "Error") { //Not existing user
            showLogin();
        } else {
            obtainRepresentations(user.id);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        showLogin();
    });
}

/**
 * Auxiliar function to show login card.
 */
function showLogin() {
    $("#representationsCard").hide();
    $("#logoutAdmin").hide();
    $("#addAdmin").hide();
    $("#editAdmin").hide();
    $("#loading").hide();
    $("#loginCard").show();
}

/**
 * Auxiliar function to show list of
 * representations.
 */
function showHome() {
    $("#representationsCard").show();
    $("#logoutAdmin").show();
    $("#addAdmin").show();
    $("#editAdmin").show();
}