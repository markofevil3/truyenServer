function ImageSlider() {
};

ImageSlider.currentPageIndex = 1;
ImageSlider.currentPage = null;
ImageSlider.currentButton = null;
ImageSlider.buttons = [];
ImageSlider.sliderPages = [];

ImageSlider.Init = function(imgSlider, pageWrap) {
  ImageSlider.sliderPages = imgSlider.getElementsByClassName('pages');
  ImageSlider.currentPage = ImageSlider.sliderPages[0];
  var buttons = pageWrap.getElementsByClassName('pagingItems');
  for (var i = 0; i < buttons.length; i++) {
    var pageIndex = buttons[i].getAttribute('data-page');
    if (buttons[i].getAttribute('data-page') != null) {
      ImageSlider.buttons[parseInt(pageIndex) - 1] = buttons[i];
    }
    // ImageSlider.buttons[i] = 
    Button.enable(buttons[i], function(e) {
      switch(e.id) {
        case 'toStart':
          ImageSlider.ChangeToPage(1);
        break;
        case 'prev':
          if (ImageSlider.currentPageIndex - 1 > 0) {
            ImageSlider.ChangeToPage(ImageSlider.currentPageIndex - 1);
          }
        break;
        case 'page1':
        case 'page2':
        case 'page3':
        case 'page4':
        case 'page5':
          ImageSlider.ChangeToPage(parseInt(e.getAttribute('data-page')));
        break;
        case 'next':
          if (ImageSlider.currentPageIndex + 1 <= 5) {
            ImageSlider.ChangeToPage(ImageSlider.currentPageIndex + 1);
          }
        break;
        case 'toEnd':
          ImageSlider.ChangeToPage(5);
        break;
      }
    });
  }
  ImageSlider.currentButton = ImageSlider.buttons[0];
};

ImageSlider.ChangeToPage = function(pageIndex) {
  if (pageIndex != ImageSlider.currentPageIndex) {
    ImageSlider.currentButton.className = "pagingItems pagingNumbs";
    $(ImageSlider.currentPage).fadeOut(200, function(){
      ImageSlider.currentPageIndex = pageIndex;
      ImageSlider.currentPage = ImageSlider.sliderPages[pageIndex - 1];
      ImageSlider.currentButton = ImageSlider.buttons[pageIndex - 1];
      ImageSlider.currentButton.className = "pagingItems pagingNumbs active";
      $(ImageSlider.currentPage).fadeIn(400);
    });
  }
};