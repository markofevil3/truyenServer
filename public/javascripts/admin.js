$("document").ready(function(){
  $( ".input-rows" ).click(function() {
    $(this).find(".editables").each(function() {
      this.disabled = false;
    });
  });
  // $('.editables').blur(function() {
  //   this.disabled = true;
  // });
});
