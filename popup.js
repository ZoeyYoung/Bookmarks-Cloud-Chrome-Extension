(function($) {
    chrome.tabs.getSelected(function(tab) {
        initForm(tab);
    });

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        initForm(tab);
    });

    var host = 'http://localhost:8888',
        url = '',
        title = '',
        favicon = '',
        html = '';
    window.onload = function() {
        var bg = chrome.extension.getBackgroundPage();
        bg.getPageInfo(function(o) {
            $("#note").val(o.note);
            html = o.html;
        });
    };

    var initForm = function(tab) {
        url = tab.url;
        title = tab.title;
        if (tab.favIconUrl) {
            favicon = tab.favIconUrl;
        }
        $("#title").val(title);
        jQuery.getJSON(host + '/bookmark/get_info', {
            url: url
        }, function(response) {
            if (response.success === 'true') {
                $('#description').val(response.description);
                tags_t = $('#tags').val();
                tags = (tags_t === '') ? response.tags : response.tags + ',' + tags_t;
                $('#tags').val(tags);
                note_t = $('#note').val();
                note = (note_t === '') ? response.note : response.note + '\n' + note_t;
                $('#note').val(note);
            } else {
                alert('数据库返回错误');
            }
        });
    };

    $(document).on('click', '#addLinkBtn', function() {
        jQuery.ajax({
            url: host + '/bookmark/add',
            data: {
                url: url,
                title: $('#title').val(),
                favicon: favicon,
                description: $('#description').val(),
                tags: $('#tags').val(),
                note: $('#note').val(),
                html: html
            },
            dataType: "json",
            type: "POST"
        }).done(function(response) {
            if (response.success === 'true') {
                window.close();
            } else {
                alert('数据库返回错误');
            }
        });
    });

    $(document).on('click', '#cancelAddLinkBtn', function() {
        window.close();
    });
})(jQuery);
