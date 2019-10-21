$(function(){
    // When DOM loads, run scrape
    // $.get("/api/scrape", function(data){
    //     console.log("latest articles have been scraped...\n" + data);
    // });

    // Add like to article
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

    // Opens comment modal
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
                addComment(commentText);

                //Increase comment-btn count                
                var count = parseInt($("#commentCount").text());
                $(".comment-btn").each(function(){
                    if($(this).attr("data-id") === commentBtnDataID){
                        $(this).html(`<i class="far fa-comments mr-1"></i>Comments(${count})`);
                    }
                });

                $("#commentBodyInput").val("");
            })
        }else{
            $("#noComment").show();
        }
    });

    // Adds comment to modal
    function addComment(body, dataID){
        var count = parseInt($("#commentCount").text()) + 1;
    
        //Increase Modal Comment Count
        $("#commentCount").text(count);

        //Add comment to modal
        $(".modal-body").append(
            $("<p>")
            .attr("class", "mx-4")
            .text(body)
        );
        $(".modal-body").append($("<hr>").attr("class", "mx-4"));
    }
});