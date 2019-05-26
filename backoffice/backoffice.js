//VARIABLES
var id;
var value = 0;
var posts;
var postId;

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

    $( "#dialog-confirm" ).dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
          "Confirm": function() {
            $.ajax({
                type: "DELETE",
                url: "https://jsonplaceholder.typicode.com/posts/"+postId
            })
            .done(function(textStatus, jqXHR) {
                $("#dialog-confirm").dialog("close");
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                alert("error...");
            });

            
          },
          Cancel: function() {
            $( this ).dialog( "close" );
          }
        }
      });
   

    obtainParam(progressbar);
});

function obtainParam(progressbar) {
    id = window.location.search.substring(1);
    progressbar.progressbar( "value", value + 25 );
    value += 25;
    obtainUser(progressbar, id);
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
            window.location.href = "http://127.0.0.1:5500/index.html"
        } else {
            if (progressbar != null) progressbar.progressbar( "value", value + 25 );
            value += 25;
            $("#userMessage").html("Welcome, " + data[0].name);
            $("#home").attr("href", "http://127.0.0.1:5500/home/home.html?" + data[0].id);
            $("#create").attr("onclick", 'location.href="http://127.0.0.1:5500/edition/edition.html?user='+id+'&post=-1"');
            obtainPosts(progressbar);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("error...");
    });
}

function obtainPosts(progressbar) {
    $.ajax({
        data: {"userId": id},
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
            posts = data;
            showPosts();
            progressbar.hide();
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("error...");
    });
}

function showPosts() {
    $("#tablePosts").append('<tbody>');
    $.each(posts, function(index, post) {

        $("#tablePosts").append('<tr><td scope="row">'+ post.id+'</td><td>'+
        post.title+'</td><td class="d-sm-flex justify-content-between"> <button class="btn btn-style" id="edit'+post.id+'">'+
        '<img class="actions-btn icon-btn" src="../img/edit_icon.png"></button>'+
        '<button class="btn remove-btn" id="delete'+post.id+'">'+
        '<img class="actions-btn icon-btn" src="../img/delete_icon.png"></button>');

        $("#edit"+post.id).attr("onclick", 'location.href="http://127.0.0.1:5500/edition/edition.html?user='+id+'&post='+post.id+'"');
        $("#delete"+post.id).click(function() {
            this.postId = post.id;
            $("#dialog-confirm").dialog("open");
        });
    });
    $("#tablePosts").append('</tbody>')
}