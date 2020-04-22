// =============================================================================

// 可以防止页面拉到底时晃动，但是要慎重使用，会屏蔽大部分后代的默认滑动事件
// document.addEventListener('touchmove', function (event) {
// 	event.preventDefault();
// }, false);
// // 或
// document.getElementById("xxxxx").addEventListener('touchmove', function (event) {
// 	event.preventDefault();
// }, false);

function wbas_ParentResetPage(name, param) {
    window.parent.wbmg_PageManager.reset(name, param);
}
function wbas_ParentShowPage(name, param) {
    window.parent.wbmg_PageManager.show(name, param);
}
function wbas_ParentPushPage(name, param, width, height) {
    window.parent.wbmg_PageManager.push(name, param, width, height);
}

// 获取资源链接中的参数
function wbas_GetUrlParam(url, arg) {
    if ( '#' == url[url.length-1] ) {
        url = url.substr(0, url.length-1);
    }

    var urlSplit = url.split("?");
    if (urlSplit.length > 1) {
        var reg = new RegExp("(^|&)" + arg + "=([^&]*)(&|$)", "i");
        var result = urlSplit[1].match(reg);
        if (result != null) {
            return unescape(result[2]);
        }
    }
    return null;
}

// 替换url上参数
function wbas_SetUrlParam(url, arg, val) {
    if ( '#' == url[url.length-1] ) {
        url = url.substr(0, url.length-1);
    }

    var urlSplit = url.split("?");
    if (urlSplit.length > 1) {
        var search = urlSplit[1];
        // 先检查是否已经有该值，有则更新，无则新增
        var argCheckExist = search.match(new RegExp(arg + '='));
        if (null == argCheckExist) {
            return (urlSplit[0] + "?" + arg + '=' + val + '&' + urlSplit[1]);
        } else {
            var pattern = arg + '=([^&]*)';
            var replaceText = arg + '=' + val;
            return urlSplit[0] + "?" + (search.match(pattern) ? search.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (search.match('[\?]') ? search + '&' + replaceText : search + '?' + replaceText));
        }
    }
    return (url + '?' + arg + '=' + val);
}

function wbas_DelUrlParam(url, params) {
    var urlSplit = url.split("?");
    if (urlSplit.length > 1) {
        var objectSearch = urlSplit[1].split("&");
        var newSearch = '';
        for (var curSearch of objectSearch) {
            var isDelete = false;
            for (var param of params) {
                if (curSearch.indexOf(param+'=') >= 0) {
                    isDelete = true;
                }
            }
            newSearch += (isDelete ? '' : '&' + curSearch);
        }

        if ( newSearch.length > 0 ) {
            newSearch = '?' + newSearch.substr(1);
            return urlSplit[0] + newSearch.replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
        }
    }
    return urlSplit[0]
}

function wbas_RefreshUrl(url) {
    if (url) {
        window.location.replace(url);
    } else {
        window.location.replace('#');
    }
}