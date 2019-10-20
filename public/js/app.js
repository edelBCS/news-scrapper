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

    $(document).on("click", ".comment-btn", function(e){
        e.preventDefault();

        var articleId = $(this).attr("data-id");

        // Remove Comments from Modal
        $(".modal-body").empty();

        // Set modal add-Comment button data-id attr
        $(".add-comment-btn").attr("data-id", articleId);

        // Get comments and insert
        $.get("/api/article/" + articleId, function(data){
            data.comments.forEach(comment => {
                addComment(comment.body);
            });
        });
    });

    $(document).on("click", ".add-comment-btn", function(e){
        e.preventDefault();

        var commentText = $("#commentBodyInput").val();

        // Get comment and insert into db
        if(commentText != ""){
            $.ajax({
                method: "POST",
                url: "/api/comment/" + $(this).attr("data-id"),
                data: {
                    body: commentText
                }
            })
            .then(function(data){
                addComment(commentText);
                $("#commentBodyInput").val("");
            })
        }else{
            alert("Enter Comment")
        }
    });

    function addComment(body){
        $(".modal-body").append(
            $("<span>")
            .attr("class", "badge badge-pill badge-info")
            .text(body)
        );
        $(".modal-body").append($("<br>"));
    }
});