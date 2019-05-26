//VARIABLES
var id;
var value = 0;
var users;
var numPages;
var pagesAndContent;
var previousPage;
var minNumPage;
var maxNumPage;
var actualPage;
var isBigSizeScreen;

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
    obtainAllUsers(progressbar);

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
            console.log("Login the user "+ data[0].name)
            if (progressbar != null) progressbar.progressbar( "value", value + 25 );
            value += 25;
            $("#userMessage").html("Welcome, " + data[0].name);
            $("#administration").attr("href", "http://127.0.0.1:5500/backoffice/backoffice.html?" + data[0].id);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("error...");
    });
}

function obtainAllUsers(progressbar) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://jsonplaceholder.typicode.com/users"
    })
    .done(function(data, textStatus, jqXHR) {
        if(data.length <= 0) { //Not existing user
            console.log("The user does not exist");
        } else {
            users = data;
            obtainPosts(progressbar);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("error...");
    });
}


function obtainPosts(progressbar) {
    $.ajax({
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
            distributePosts(data);
            setPagination(data);
            configureNext();
            showPosts(0);
            progressbar.hide();
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert("error...");
    });
}

function distributePosts(data) {

    $(window).resize(function() { 
        if (isBigSizeScreen && $(window).width() < 768) {
            distributePosts(data);
            reloadPagination();
            isBigSizeScreen = false;
        } else if (!isBigSizeScreen && $(window).width() > 768){
            distributePosts(data);
            reloadPagination();
            isBigSizeScreen = true;
        }
    });

    pagesAndContent = [];
    numPages = data.length/5;
    minNumPage = 0;

    if ($(window).width() < 768  && numPages > 5) {
        maxNumPage = 4;
    } else if (numPages > 10) {
        maxNumPage = 9;
    } else {
        maxNumPage = numPages;
    }
    
    for (page = 0; page < numPages; page++) {
        pagesAndContent[page] = data.slice(page*5, (page*5)+5);
    }
}

function showPosts(actualPage) {
    this.actualPage = actualPage;
    var numactual = actualPage+1;
    var numprevious = previousPage+1;
    $("#page"+numprevious).children("a").removeClass("page-selected");
    previousPage = actualPage;
    $("#page"+numactual).children("a").addClass("page-selected");
    $("#listPosts").empty();

    $.each(pagesAndContent[actualPage], function(index, post) {
        var user = users.filter(user => user.id == post.userId);

        $("#listPosts").append('<div class="d-flex justify-content-center pb-3"><div class="card card-posts"><div class="card-title d-flex align-self-center pt-2 pb-0"><h3>'+
        post.title+'</h3></div><hr class="mt-0" /><div class="card-body "><p class="card-text" id="postText">'+
        post.body+'</p><label class="card-text d-sm-flex justify-content-between"><p id="postDate"><img class="icon-img" src="../img/date_icon.png">'+
        '01/02/2019'+'</p><p id="postUser"><img class="icon-img" src="../img/person_icon.png"> '+
        user[0].name+'</p></label></div></div></div>')
    });
}

function setPagination(data) {
    
    for (count = minNumPage; count < maxNumPage; count++) {
        numb = count+1;
        $("#pagination").append('<li class="page-item" id="page'+numb+'"><a class="page-link" href="#">'+numb+'</a></li>')
        $("#page"+numb).click(function () {
            reloadPagination();
            showPosts($(this).children("a").html()-1);
        });
    }

    
}

function configurePrevious() {
    createPaginationButton('Previous', 'laquo');
    $("#Previous").click(function() {

        if(actualPage == maxNumPage-1) {
            actualPage--;
        }

        if (minNumPage > 0) {
            minNumPage--;
            maxNumPage--;
            reloadPagination();
        }

        showPosts(actualPage);
    });
}

function configureNext() {
    createPaginationButton('Next', 'raquo');
    $("#Next").click(function() {

        if(actualPage == minNumPage) {
            actualPage++;
        }

        if(maxNumPage < numPages) {
            minNumPage++;
            maxNumPage++;
            reloadPagination();
        }

        showPosts(actualPage);
    });
}

function reloadPagination() {
    $("#pagination").empty();
    configurePrevious();
    setPagination();
    configureNext();
}

function createPaginationButton(name, symbol) {
    $("#pagination").append('<li class="page-item" id="'+name+'"><a class="page-link" href="#" aria-label="'+name+'">'+
    '<span aria-hidden="true">&'+symbol+';</span><span class="sr-only">'+name+'</span></a></li>');
}