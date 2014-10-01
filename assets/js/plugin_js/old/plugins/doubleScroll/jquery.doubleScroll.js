/*
 * @name DoubleScroll
 * @desc displays scroll bar on top and on the bottom of the div
 * @requires jQuery, jQueryUI
 *
 * @author Pawel Suwala - http://suwala.eu/
 * @version 0.2 (07-06-2012)
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

(function($){
    $.widget("suwala.doubleScroll", {
		options: {
            contentElement: undefined, // Widest element, if not specified first child element will be used
			topScrollBarMarkup: '<div class="suwala-doubleScroll-scroll-wrapper" style="height: 8px;"><div class="suwala-doubleScroll-scroll" style="height: 8px;"></div></div>',
			topScrollBarInnerSelector: '.suwala-doubleScroll-scroll',
			scrollCss: {
				'overflow-x': 'scroll',
				'overflow-y':'hidden'
            },
			contentCss: {
				'overflow-x': 'scroll',
				'overflow-y':'hidden'
			}
        },
        _create : function() {
            var self = this;
			var contentElement;
            var scrollbar_offset = 1; // topScrollBar - bottomScrollBar

            // add div that will act as an upper scroll
			var topScrollBar = $($(self.options.topScrollBarMarkup));
            self.element.before(topScrollBar);

            // find the content element (should be the widest one)
            contentElement = self.element.find('.dataTables_scrollBody > table');

            // bind upper scroll to bottom scroll
            topScrollBar.scroll(function(){
            	if ((topScrollBar.scrollLeft()-scrollbar_offset)!=self.element.children(".dataTables_scrollBody").scrollLeft()){
            		self.element.children(".dataTables_scrollBody").scrollLeft(topScrollBar.scrollLeft());
            	}
            });

            // bind bottom scroll to upper scroll
            self.element.children(".dataTables_scrollBody").scroll(function(){
            	if ((self.element.children(".dataTables_scrollBody").scrollLeft()+scrollbar_offset)!= topScrollBar.scrollLeft()){
            		topScrollBar.scrollLeft(self.element.children(".dataTables_scrollBody").scrollLeft());
            	}
            });

            // apply css
            topScrollBar.css(self.options.scrollCss);
            self.element.css(self.options.contentCss);

            // set the width of the wrappers
            $(self.options.topScrollBarInnerSelector, topScrollBar).width(contentElement.outerWidth());
            //topScrollBar.width(self.element.width());
            topScrollBar.width("100%");

            // correct topScrollBar position
            topScrollBar.css("position",self.element.css("position"));
            topScrollBar.css("left",self.element.css("left"));
            self.element.css("top","8px");
        }
    });
})(jQuery);