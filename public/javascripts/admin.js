var checkStoryTable =
  Haml.compile('table(border=1)',
               '  tr',
               '    td Tên Truyện',
               '    td Tác Giả',
               '  | #{rows}'
  );

var checkStoryTableRow =
  Haml.compile('tr',
               '  td #{title}',
               '  td #{author}'
  );

var globalData;

$("document").ready(function(){
  $( ".input-rows" ).click(function() {
    $(this).find(".editables").each(function() {
      this.disabled = false;
    });
  });
});

function checkStory() {
  var titleInput = document.getElementById("story-title");
  if (titleInput.value != null && titleInput.value != "") {
    $.ajax( "/checkStory?title=" + titleInput.value)
      .done(function(response) {
        console.log(response);
        if (response.data.length > 0) {
          var rows = '';
          for (var i = 0; i < response.data.length; i++) {
            rows += checkStoryTableRow({
              title: response.data[i].title,
              author: response.data[i].author
            });
          }
          $("#check-results").html(checkStoryTable({
            rows: rows
          }));
        } else {
          $("#check-results").html("không có truyện giống!");
        }
      })
      .fail(function() {
        alert("error");
      })
  }
}

var addChapterDiv = 
  Haml.compile('div(class="chapterContentDiv")',
               '  span -------------------------------------------<br>',
               '    div Số Thứ Tự Chapter:',
               '    input(name="chapter-chapter-#{i}" type="text" value="" class="editables")',
               '    div Tên Chapter:',
               '    input(name="chapter-title-#{i}" type="text" value="" class="editables")',
               '    div Nội Dung:',
               '    textarea(name="chapter-content-#{i}", id="chapter-content-#{i}", class="editables", value="")',
               '  span -------------------------------------------'
);

function addMoreChapter() {
  var i = $(".chapterContentDiv").length + 1;
  $("#chapters-wapper").append(addChapterDiv({i : i}));
  $("#chapter-count").val(i);
  CKEDITOR.replace( 'chapter-content-' + i.toString(),{
    width: "480px",
  });
}

function removeStory(storyId, storyName, accessToken) {
  var confirmBox = confirm("Xoá truyện: " + storyName + " ?");
  if (confirmBox == true) {
    $.ajax( "/removeStory?id=" + storyId + "&accessToken=" + accessToken)
      .done(function(response) {
        if (response.data == 'success') {
          window.location.replace("/admin?accessToken=" + accessToken);
        } else {
          alert('Không có quyền xoá!');
        }
      })
      .fail(function() {
        window.location.replace("/admin?accessToken=" + accessToken);
      })
  }
}

function openAddStoryChapterPage(storyId) {
  window.location.replace('/addStoryChapter?id=' + storyId);
}

function openListChaptersPage(storyId) {
  window.location.replace('/listStoryChapters?id=' + storyId);
}

function removeStoryChapter(storyId, chapterId, chapterTitle) {
  var confirmBox = confirm("Xoá chương : " + chapterTitle + " ?");
  if (confirmBox == true) {
    window.location.replace('/removeStoryChapter?storyId=' + storyId + '&chapterId=' + chapterId);
  }
}

function openEditStoryChapterPage(storyId, chapterId) {
  window.location.replace('/editStoryChapter?storyId=' + storyId + '&chapterId=' + chapterId);
}