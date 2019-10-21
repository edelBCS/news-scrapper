$(function(){
    // Add like to article when like btn is clicked
    $(document).on("click", ".like-btn", function(e){
        e.preventDefault();

        $.ajax({
            method: "POST",
            url: "/api/addlike/" + $(this).attr("data-id")
        })
        .then(data => {
            var likes = "Likes(" + data.likes + ")";
            $(this).text(likes);
            $(this).prepend($("<i>").attr("class", "far fa-thumbs-up mr-1"));
            $(this).prop("disabled", true);
        });
    });
    
    // Run the scraper
    $(document).on("click", "#scrape-btn", function(e){
        e.preventDefault();

        $.get("/api/scrape", function(data){
            if(data){
                location.reload();
                console.log("scrape successful");
            }
            else
                console.log("scrape fail");
        });
    });

    // Clears and reloads comments when comment modal is opened
    $(document).on("click", ".comment-btn", function(e){
        e.preventDefault();

        var articleId = $(this).attr("data-id");
        
        //hide comment error
        $("#noComment").hide();

        // Remove Comments from Modal
        $(".modal-body").empty();
        $("#commentCount").text("0");

        // Set modal add-Comment button data-id attr
        $(".add-comment-btn").attr("data-id", articleId);

        // Get comments and insert
        $.get("/api/article/" + articleId, function(data){
            data.comments.forEach(comment => {
                addComment(comment.body);
            });
        });
    });

    // Adds comment to DB and modal when Add Comment is clicked
    $(document).on("click", ".add-comment-btn", function(e){
        e.preventDefault();

        var commentText = $("#commentBodyInput").val();
        var commentBtnDataID = $(this).attr("data-id");

        // Get comment and insert into db
        if(commentText != ""){
            $.ajax({
                method: "POST",
                url: "/api/comment/" + commentBtnDataID,
                data: {
                    body: commentText
                }
            })
            .then(function(data){
                //display new comment
                addComment(commentText);

                //Increase count on comment-btn                 
                var count = parseInt($("#commentCount").text());
                $(".comment-btn").each(function(){
                    if($(this).attr("data-id") === commentBtnDataID){
                        $(this).html(`<i class="far fa-comments mr-1"></i>Comments(${count})`);
                    }
                });

                //clear comment input area
                $("#commentBodyInput").val("");
            })
        }else{
            //shows warning is comment input area is empty
            $("#noComment").show();
        }
    });

    // writes comment to modal DOM
    function addComment(body, dataID){
        var count = parseInt($("#commentCount").text()) + 1;
    
        //Increase Modal Comment Count
        $("#commentCount").text(count);

        //Append comment to modal
        $(".modal-body").append(
            $("<p>")
            .attr("class", "mx-4")
            .text(body)
        );
        $(".modal-body").append($("<hr>").attr("class", "mx-4"));
    }
});