'use strict';

var shareMenu = {
    init: function(e, i, t) {
        $(e).click(function() {
            $(i).toggle();
            if($(i).css('display') != 'none') {
                $(t).removeClass('fa-share').addClass('fa-close');
            } else {
                $(t).removeClass('fa-close').addClass('fa-share');
            }
        });
    }
}

$(document).ready(function(){
   shareMenu.init('#share-menu-trigger', '.share-menu', '#share-btn');
});