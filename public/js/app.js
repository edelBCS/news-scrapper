$(function(){
    // When DOM loads, run scrape
    // $.get("/api/scrape", function(data){
    //     console.log("latest articles have been scraped...\n" + data);
    // });

    $(document).on("click", ".comment-btn", function(e){
        e.preventDefault();

        var articleId = $(this).attr("data-id");

        // Set modal add Comment button data-id attr
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