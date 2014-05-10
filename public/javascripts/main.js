$(document).ready(function() {
  console.log("doc ready stuff");
  // Place JavaScript code here...
  //Search Bar
  $search_field = $('#search');
  $search_field.submit(function(){
    event.preventDefault();
    input = $search_field.children('input').val();
    alert(input);
    //make ajax call
    // $.ajax({
    //  	dataType: "json",
    // 	url:  "http://api.mtv.com/api/dY20ptWs4Knh/search.json?q=awkward&types=playlist,video",
    // 	data: data,
    // 	success: success
    // });
  });
});