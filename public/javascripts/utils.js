function Utils() {
};

function createNode(html) {
  var tempDiv = document.createElement('div');

  tempDiv.innerHTML = html;
  return tempDiv.firstChild;
};

function getStatusString(statusIndex) {
  switch (statusIndex) {
    case 0:
      return "Full";
    break;
  }
};

function showPopupPreview(content) {
  console.log("#########");
  loading();
	setTimeout(function(){
		loadPopup();
	}, 200);

	$("div.close").click(function() {
		disablePopup();
	});

	$(this).keyup(function(event) {
		if (event.which == 27) {
			disablePopup();
		}
	});

  $("div#backgroundPopup").click(function() {
		disablePopup();
	});

	 /************** start: functions. **************/
	function loading() {
		$("div.loader").show();
	}
	function closeloading() {
		$("div.loader").fadeOut('normal');
	}

	var popupStatus = 0; // set value

	function loadPopup() {
		if(popupStatus == 0) { // if value is 0, show popup
			closeloading(); // fadeout loading
			$("#popup_content").html(content);
			$("#toPopup").fadeIn(0500); // fadein popup div
			$("#backgroundPopup").css("opacity", "0.7"); // css opacity, supports IE7, IE8
			$("#backgroundPopup").fadeIn(0001);
			popupStatus = 1; // and set value to 1
		}
	}

	function disablePopup() {
		if(popupStatus == 1) { // if value is 1, close popup
			$("#toPopup").fadeOut("normal");
			$("#backgroundPopup").fadeOut("normal");
			popupStatus = 0;  // and set value to 0
		}
	}
}