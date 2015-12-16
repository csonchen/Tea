/**
 * Created by Administrator on 2015/12/13 0013.
 */
$(document).ready(function () {
    /**
     * 首页
     */
    // banner
    var slide11 = new Slide({
        target: $('#JSlide1 .pics li'),
        control:  $('#JTab1 a'),
        effect: 'slide',
        direction: 'y'
    });
    new Slide({
        target: $('#JSlide1 .pics li'),
        control:  $('#JTab1 .ctrl'),
        effect: 'slide',
        autoPlay: true,
        stay:3000,
        prevBtn:$('#prev1'),
        nextBtn:$('#next1'),
        onchange: function() {
            slide11.playTo(this.curPage);
        }
    });

    // middle
    new Slide({
        width: 300,
        control:false,
        target:$('#JSlide2 .item'),
        effect: 'slide',
        stay: 3000,
        autoPlay: true,
        direction: 'x',
        merge: true
    });

    /**
     * 回到顶部
     * @type {*|jQuery|HTMLElement}
     */
    $('#to_top').click(function() {
        document.documentElement.scrollTop = document.body.scrollTop =0;
    });

    /**
     * 奶茶饮品
     */
    //弹出+滑动
    $('.fancybox').fancybox();
});