$(document).ready(function() {
    var remember_check = false;
    var progressbar = $( "#progressbar" ),
    progressLabel = $( ".progress-label" );

    /**
     * This function call the service and obtain the user that
     * corresponds to the email introduced. If the service doesnt 
     * return a user, it doesnt exist.
     */
    $("#loginForm").submit(function(event) {
        event.preventDefault();
        $.ajax({
            data: {"email": $("#emailForm").val()},
            type: "GET",
            dataType: "json",
            url: "https://jsonplaceholder.typicode.com/users"
        })
        .done(function(data, textStatus, jqXHR) {
            if(data.length <= 0) { //Not existing user
                console.log("The user does not exist");
                $("#alert").show();
            } else {
                console.log("Login the user "+ data[0].name)
                $("#alert").hide();
                window.location.href = "http://127.0.0.1:5500/home/home.html?" + data[0].id;
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