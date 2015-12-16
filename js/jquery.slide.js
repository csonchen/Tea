/*! Copyright 2012, Ben Lin (http://dreamerslab.com/)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 1.0.16
 *
 * Requires: jQuery >= 1.2.3
 */
(function(a){a.fn.addBack=a.fn.addBack||a.fn.andSelf;
a.fn.extend({actual:function(b,l){if(!this[b]){throw'$.actual => The jQuery method "'+b+'" you called does not exist';}var f={absolute:false,clone:false,includeMargin:false};
var i=a.extend(f,l);var e=this.eq(0);var h,j;if(i.clone===true){h=function(){var m="position: absolute !important; top: -1000 !important; ";e=e.clone().attr("style",m).appendTo("body");
};j=function(){e.remove();};}else{var g=[];var d="";var c;h=function(){c=e.parents().addBack().filter(":hidden");d+="visibility: hidden !important; display: block !important; ";
if(i.absolute===true){d+="position: absolute !important; ";}c.each(function(){var m=a(this);var n=m.attr("style");g.push(n);m.attr("style",n?n+";"+d:d);
});};j=function(){c.each(function(m){var o=a(this);var n=g[m];if(n===undefined){o.removeAttr("style");}else{o.attr("style",n);}});};}h();var k=/(outer)/.test(b)?e[b](i.includeMargin):e[b]();
j();return k;}});})(jQuery);

;(function( window, $ ){
    function Slide( options ){
        this.config = $.extend( {}, Slide.config, options );
        this._init();
    }

    Slide.config = {
        stay: 2000,
        delay: 200,
        animateTime: 300,
        playTo: 0,
        autoPlay: false,
        link: false,
        lazy: false,
        merge: false,
        effect: 'base',
        curClass: 'current',
        type: 'mouseover',
        direction: 'x',
        oninit: function(){},
        onchange: function(){}
    };

    Slide.prototype = {
        _init: function(){
            var self = this,
                c = this.config;

            if( !c.target.length ) return;

            this.target = c.target;
            this.prevBtn = c.prevBtn || null;
            this.nextBtn = c.nextBtn || null;
            this.effect = Slide.effect[ c.effect ];
            this.length = c.target.length;

            this.wrap = this.target.parent();
            if( /(?:ul|ol|dl)/i.test( this.wrap[0].tagName ) ){
                this.content = this.wrap;
                this.wrap = this.wrap.parent();
            }else{
	            // jQuery �� append �ᵼ�� script ����ִ�У��Ӷ���ʹ�� textarea �� lazy ʱ���� textarea ���պ϶������˺�������ݵ�����
                var _jTmpWrap = $( '<div class="slideContent"></div>' )
                    _tmpWrap = _jTmpWrap.get(0);
                var _frag = document.createDocumentFragment();
                for(var _i = this.target.length - 1; _i >= 0; _i--) {
	                _frag.insertBefore(this.target[_i], _frag.firstChild);
                }
                _tmpWrap.appendChild(_frag);
                this.wrap.get(0).appendChild(_tmpWrap);
                
                this.content = _jTmpWrap;
                _jTmpWrap = null;
                _tmpWrap  = null;
            }

            if( c.control !== false ){
                c.control = c.control || $( '.control', this.wrap );
                if( c.control && c.control.length ){
                    this.control = c.control.not( '.prev, .next' );
                    if( !this.prevBtn ) this.prevBtn = c.control.filter( '.prev' );
                    if( !this.nextBtn ) this.nextBtn = c.control.filter( '.next' );
                }else{
                    var ul = $( '<ul class="control"></ul>' ),
                        tocStr = '';
                    for( var i = 0; i < this.length; i++ ){
                        tocStr += '<li><a href="javascript:;">'+ ( i + 1 ) +'</a></li>';
                    }
                    tocStr = $( tocStr );
                    ul = ul.append( tocStr );
                    this.wrap.append( ul );
                    this.control = tocStr;
                }
            }

            c.oninit.call(self);

            if( this.effect ) this.effect.oninit.call( this );

            this.playTo( c.playTo );
            if( c.autoPlay ) this.play();

            this._attach();
        },
        _attach: function(){
            var self = this,
                c = this.config,
                control = this.control,
                prevBtn = this.prevBtn,
                nextBtn = this.nextBtn,
                type = c.type,
                needDelay = type === 'mouseover',
                delay =  c.delay;

            if( c.autoPlay ){
                var stopElems = [ this.wrap ],
                    ctrlBar = control && control.parent();
                if( ctrlBar ) stopElems.push( ctrlBar );
                if( this.prevBtn ) stopElems.push( this.prevBtn );
                if( this.nextBtn ) stopElems.push( this.nextBtn );

                $.each( stopElems, function(){
                    this.bind({
                        'mouseover': function(){
                            self.stop();
                        },
                        'mouseout': function(){
                            self.play();
                        }
                    });
                });       
            }

            if( control && control.length ){
                control.each(function( i ){
                    var $this = $( this );
                    $this.bind( type, function(){
                        clearTimeout( self.delayTimer );
                        self.delayTimer = setTimeout(function(){
                            self.playTo( i );
                        }, delay);
                    });

                    if( needDelay ){
                        $this.bind({
                            'mouseout': function(){
                                clearTimeout( self.delayTimer );
                            },
                            'click': function(){
                                clearTimeout( self.delayTimer );
                                self.playTo( i );
                            }
                        });
                    }

                    if( !c.link ){
                        $this.bind( 'click', function( e ){
                            e.preventDefault();
                        });
                    }

                });
            }


            if( prevBtn ){
                prevBtn.bind( 'click', function( e ){
                    self.prev();
                    e.preventDefault();
                });
            }

            if( nextBtn ){
                nextBtn.bind( 'click', function( e ){
                    self.next();
                    e.preventDefault();
                });
            }
        },
        playTo: function( page ){
            var $control = this.control,
                curClass = this.config.curClass,
                prevPage;

            if( this.curPage === page ) return;

            this.prevPage = this.curPage;

            if( this.config.effect === 'slide' && this.config.merge ){
                prevPage = this._outBound( this.curPage );
                this.curPage = page;
                page = this._outBound( page );
            }else{
                prevPage = this.curPage;
                page = this.curPage = this._outBound( page );
            }

            if( $control && $control.length ){
                $control.eq( prevPage ).removeClass( curClass );
                $control.eq( page ).addClass( curClass );
            }

            if( this.config.lazy ){
                var $curTarget = this.target.eq( page );
                if( $curTarget.length && !$curTarget[0].parsed ){
                    this._lazyLoad( $curTarget );
                }
            }

            if( this.effect ) this.effect.onchange.call( this );
            this.config.onchange.call( this );

        },
        prev: function(){
            this.playTo( this.curPage - 1 );
        },
        next: function(){
            this.playTo( this.curPage + 1 );
        },
        play: function(){
            var self = this;
            this.stop();
            this.timer = setInterval(function(){
                self.playTo( self.curPage + 1 );
            }, self.config.stay );
        },
        stop: function(){
            clearInterval( this.timer );
        },
        _outBound: function( i ){
            var length = this.length;
            if( i >= length ) i %= length;
            if( i < 0 ){
                var m = i % length;
                i = m === 0 ? 0 : ( m + length );
            }
            return i;
        },
        _lazyLoad: function( $obj ){
            var textarea = $( 'textarea', $obj );
            if( textarea.length ){
                $obj.html( textarea.val() );
                $obj[0].parsed = true;
            }
        }
    }

    Slide.effect = {
        base: {
            oninit: function(){ 
                this.target.hide().eq( this.config.playTo ).show();
            },
            onchange: function(){
                var $target = this.target;
                $target.eq( this.prevPage ).hide();
                $target.eq( this.curPage ).show();
            }
        },
        fade: {
            oninit: function(){
                this.content.css({
                    'position': 'relative',
                    'overflow': 'hidden'
                });
                this.target.css({
                    'position': 'absolute'
                });
                this.target.hide();
            },
            onchange: function(){
                var $target = this.target;
                $target.eq( this.prevPage ).fadeOut();
                $target.eq( this.curPage ).fadeIn();
            }
        },
        slide: {
            oninit: function(){
	            // jQuery ʽ�� wrap �� append �Ȼ��� textarea ��������⣬���ô� dom �� append
	            $('<div class="contentWrap" style="overflow:hidden; position: relative; zoom:1; width:100%; height:100%;"></div>')
                    .insertBefore(this.content)
                    .get(0)
                    .appendChild(this.content.get(0));
                this.contentWrap = this.content.parent();

                if( this.config.direction === 'x' ){
                    this.step = this.config.width || this.target.eq( 0 ).outerWidth();
                    this.prop = 'scrollLeft';
                    this.boxProp = 'width';
                }else{
                    this.step = this.config.height || this.target.eq( 0 ).outerHeight();
                    this.prop = 'scrollTop';
                    this.boxProp = 'height';
                }

                this.showNum = Math.floor( parseFloat( this.wrap.actual(this.boxProp) ) / this.step );

                if( this.config.merge ){
                    this.showNum = Math.ceil( parseFloat( this.wrap.actual(this.boxProp) ) / this.step );
                    var cloneArr = this.target.clone( true );
                    // 2013/08/01 lazy ʱ jQuery �� append �������⣬תΪԭ��
                    var frag = document.createDocumentFragment();
                    cloneArr.each(function(){
	                    frag.appendChild(this);
                    });
                    this.content.get(0).appendChild(frag);
                    
                    $.merge( this.target, cloneArr );
                    this.plus = 0;
                }

                if( this.config.direction === 'x' ){
                    this.content.width( this.step * this.target.length );
                    this.target.css( 'float', 'left' );
                }

            },
            onchange: function(){
                var self = this,
                    c = this.config,
                    from = this.prevPage === window.undefined ? 0 : this.prevPage,
                    to = this.curPage,
                    pos;

                merge: if( c.merge ){
                    var across = to - from,
                        num = Math.abs( across );

                    if( this.realCurPage === window.undefined ){
                        this.realCurPage = to;
                        this.realPrevPage = from;
                    }

                    if( across === 0 ){
                        break merge;
                    }

                    if( across > 0 ){
                        if( to <= this.target.length + this.plus - this.showNum ){
                            var tmp = this.realCurPage;
                            this.realCurPage = this.plus === 0 ? to : this.realCurPage + 1;
                            this.realPrevPage = tmp;
                            break merge;
                        }

                        this.realCurPage = this.target.length - this.showNum;
                        this.realPrevPage = this.realCurPage - 1;

                        var tarArr = $.makeArray( this.target );
                        for( var i = 0; i < num; i++ ){
                            var elem = tarArr.shift();
                            this.content.append( elem );
                            this.target = this.content.children();
                        }
                    }else if( across < 0 ){
                        if( to > this.showNum && this.realCurPage > 0 ){
                            this.realPrevPage = this.realCurPage;
                            this.realCurPage--;
                        }else{
                            this.realPrevPage = 1;
                            this.realCurPage = 0;
                        }

                        if( to >= this.plus ){
                            break merge;
                        }

                        var tarArr = $.makeArray( this.target );
                        for( var i = 0; i < num; i++ ){
                            var elem = tarArr.pop();
                            this.content.prepend( elem );
                            this.target = this.content.children();
                        }

                    }

                    this.plus += across;
                    this.contentWrap[0][this.prop] -= across * this.step;

                }

                if( c.merge ){
                    pos = ( to - this.plus ) * this.step;
                }else{
                    if( to + this.showNum > this.length ) to = this.length - this.showNum;
                    pos = to * self.step;
                }

                var o = {};
                o[ this.prop ] = pos;

                this.contentWrap.stop( true );
                this.contentWrap.animate( o, c.animateTime );
            }
        }
    }

    var focus = Slide.focus = function( p ){
        p = $.extend( {}, focus.config, p )
        return new Slide( p );
    }
    focus.prototype = Slide.prototype;
    focus.config = {
        autoPlay: true,
        effect: 'fade'
    }

    var marquee = Slide.marquee = function( p ){
        p = $.extend( {}, marquee.config, p )
        return new Slide( p );
    };
    marquee.prototype = Slide.prototype;   
    marquee.config = {
        effect: 'slide',
        merge: 'true',
        control: false,
        direction: 'y',
        autoPlay: true
    };

    // scroll����
    var tabScroll = Slide.scroll = function (p ){
        p = $.extend( {}, tabScroll.config, p )
        return new Slide( p );
    };
    tabScroll.prototype = Slide.prototype; 
    tabScroll.config = {
        effect: 'slide',
        merge: 'true',
        control: false
    };

    window.Slide = Slide;

})( window, jQuery );