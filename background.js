var dataListJson = null;
$(function(){


    function getDomainFromUrl(url){
        var host = "null";
        if(typeof url == "undefined" || null == url)
            url = window.location.href;
        var regex = /.*\:\/\/([^\/]*).*/;
        var match = url.match(regex);
        if(typeof match != "undefined" && null != match)
            host = match[1];
        return host;
    }

    function checkForValidUrl(tabId, changeInfo, tab) {
        if(getDomainFromUrl(tab.url).toLowerCase()=="www.baidu.com"){
            //chrome.pageAction.show(tabId);

            chrome.bookmarks.getTree(function(results){
                var rootNode = results[0].children;
                for(var index in rootNode){
                    var node = rootNode[index];
                    getBookmark(node);
                }
            })

        }
    };

    chrome.tabs.onUpdated.addListener(checkForValidUrl);

    //$("#btnStart").click(function(){
    //
    //});

    chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
            if (request.greeting == "start")
                sendResponse({dataListJson: dataListJson});
      });
})


function checkUrl(url){
    var ajaxTimeoutTest = $.ajax({
        url:url,  //请求的URL
        timeout : 10000, //10 s，超时时间设置，单位毫秒
        type : 'get',  //请求方式，get或post
        data :{},  //请求所传参数，json格式
        dataType:'json',//返回的数据格式
        success:function(data, textStatus, jqXHR){ //请求成功的回调函数
            console.log("成功,"+textStatus+","+url);
        },
        error:function( jqXHR,textStatus, errorThrown ){
            console.log("失败,"+textStatus+","+url);
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
                ajaxTimeoutTest.abort();
                console.log("超时,"+url);
            }
        }
    });
}


function getBookmark(bmNode){
    var hasChild = true;
    try{
        hasChild = (typeof bmNode.children != "undefined");
    }catch(e){
        hasChild = false;
    }
    if(hasChild) {  //folder
        for(var i in bmNode.children){
            var node = bmNode.children[i];
            getBookmark(node);
        }
    }else{  //leaf
        console.log(bmNode.title+","+bmNode.url)
    }
}


