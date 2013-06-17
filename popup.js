(function($) {
  var host = 'http://localhost:8888';
  var url, title, favicon;

  var initAddLinkForm = function(response) {
    $('#description').val(response.description);
    $('#tags').val(response.tags);
    $('#note').val(response.note);
    if(response.is_star == 1) {
      $('#isstar').prop('checked', true)
    }
    if(response.is_readed == 1) {
      $('#isreaded').prop('checked', true)
    }
    $('#linkForm').show();
    $('#linkInfoInputs').show();
  };

  var initForm = function(tab) {
    url = tab.url;
    title = tab.title;
    favicon = tab.favIconUrl;
    $("#title").val(title);
    $("#favicon").val(favicon);
    jQuery.getJSON(host + '/link/get_info', {url: url}, function(response) {
        if (response.success === 'true') {
          initAddLinkForm(response);
        } else {
          alert('数据库返回错误');
        }
    });
  };

  $(document).on('click', '#addLinkBtn', function() {
    var is_star = 0
    var is_readed = 0
    if($('#isstar').is(':checked')) {
      is_star = 1;
    }
    if($('#isreaded').is(':checked')) {
      is_readed = 1;
    }
    jQuery.ajax({
      url: host + '/link/add',
      data: {url: url, title: $('#title').val(), favicon: favicon, description: $('#description').val(), tags: $('#tags').val(), note: $('#note').val(), is_star: is_star, is_readed: is_readed},
      dataType: "json",
      type: "POST",
      success: function(response) {
        if(response.success === 'true') {
          window.close();
        } else {
          alert('数据库返回错误');
        }
      }
    });
  });

  $(document).on('click', '#cancelAddLinkBtn', function() {
    window.close();
  });

  chrome.tabs.getSelected(function(tab) {
    initForm(tab);
　});

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    initForm(tab);
  });
})(jQuery);