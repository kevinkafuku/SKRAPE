$.getJSON("/Blogs", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#Blogs").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br><a target='_blank' href='https://www.vividseats.com/blog/best-rap-hip-hop-blogs" + data[i].link + "'> Link to Blogs </a>" + "</p>");
    }
  });
  
  $(document).on("click", "p", function() {
    $("#Notes").empty();
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/Blogs/" + thisId
    })
      .then(function(data) {
        console.log(data);
        $("#Notes").append("<h2>" + data.title + "</h2>");
        $("#Notes").append("<input id='titleinput' name='title' >");
        $("#Notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#Notes").append("<button data-id='" + data._id + "' id='savenote'>Save</button>");
  
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/Blogs/" + thisId,
      data: {
        title: $("#titleinput").val(),

        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });