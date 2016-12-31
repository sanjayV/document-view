/*$(function() {
	var canvas = window._canvas = new fabric.Canvas("viewerCanvas");

	var setCanvasHeightWidth = function() {
		$('')
	}
	setCanvasHeightWidth();
});*/

var viewer = function(options) {
    //Default values
    this.parentElement = ".main-div";
    this.maxWidth = 2000;
    this.maxHeight = 2000;
    this.videoControl = false;
    this.data = [];
    this.callback = function() {};
    $.extend(this, options);

    //custom values
    this.current = 1;
    this.currentData;
    this.total = 1;
    this.canvasElement = "viewerCanvas";
    this.canvasElementId = "image-viewer-div";
    this.isViewerReady = false;
    this.canvasObj;
    this.videoObj;
    this.pdfObj;
    this.errorObj;
    this.canvasImageObj;
    this.typeRex = /(?:\.([^.]+))?$/;
    this.supportedImageType = ['jpg', 'jpeg', 'png', 'gif'];
    this.supportedPdfType = ['pdf'];
    this.supportedVideoType = ['mp4', 'mp3'];

    //Init the plugin
    this.init();
};

viewer.prototype = {
    init: function(obj) {
        var _this = this;
        this.createCanvasObj(); //create canvas object for image viewer
        this.createVideoObj(); //create video object for video viewer
        this.createPdfObj(); //create video object for pdf viewer
        this.createErrorObj(); //create error object
        
        this.appendElements();
        this.setDynamicHeightWidth();
        this.isViewerReady = true;

        this.callback({'initialize': this.isViewerReady});
        this.setEvent();

        if (this.data && this.data.length) {
            this.setData(_this.data)
        }
    },
    createCanvasObj: function() {
        var _this = this;
        this.canvasElement = $('<canvas/>',{'id': _this.canvasElementId});
    },
    createVideoObj: function() {
        var _this = this;
        this.videoObj = $('<video />', {'controls': _this.videoControl, 'class': 'hide', 'width': '100%', 'height': '100%'})
                        .append($('<source />', {'type': 'video/mp4'}));
    },
    createPdfObj: function() {
        this.pdfObj = $('<iframe />', {'scrolling': 'auto', 'class': 'hide', 'frameborder': 0, 'width': '100%', 'height': '100%'});
    },
    createErrorObj: function() {
        this.errorObj = $('<div />', {'class': 'hide error-div height-100 width-100 text-center position-relative'})
                        .append($('<span />', {'class': 'position-absolute'}));
    },
    setDynamicHeightWidth: function() {
        var cheight = this.maxHeight,
        	cwidth = this.maxWidth;

        if ($(this.parentElement).height() < this.maxHeight) {
        	cheight = $(this.parentElement).height();
        }

        if ($(this.parentElement).width() < this.maxWidth) {
        	cwidth = $(this.parentElement).width();
        }

        this.canvasObj.setWidth(cwidth);
		this.canvasObj.setHeight(cheight);
		this.canvasObj.calcOffset();
		this.canvasObj.renderAll();
    },
    appendElements: function() {
        $(this.parentElement)
        .html('')
        .append(this.canvasElement)
        .append(this.videoObj)
        .append(this.pdfObj)
        .append(this.errorObj);

        this.fabricCanvasObj(); //create fabric canvas object
    },
    fabricCanvasObj: function() {
        var _this = this;
        this.canvasObj = new fabric.Canvas(_this.canvasElementId);
        this.canvasElement.parent().addClass('hide');
    },
    setEvent: function() {
        var _this = this;

        $('.prev').unbind('click').bind('click', function() {
            _this.paginationEvent('prev');
        });

        $('.next').unbind('click').bind('click', function() {
            _this.paginationEvent('next');
        });

        $('.viewer-current').unbind('keypress').bind('keypress', function(e) {
            if(e.which == 13 && $(this).val() !== "" && !isNaN(parseInt($(this).val()))) {
                _this.paginationEvent('enter', parseInt($(this).val()));
            } else {
                alert('Invalid page.');
            }
        });
    },
    setData: function(data) {
        var _this = this;
        if (!this.isViewerReady) {
            alert('Viewer is not ready for use.')
            return false;
        }

        if (!data || !data instanceof Array) {
            alert('Provided data not valid');
            return false;
        } else if (!data.length) {
            alert('Provided data is blank');
            return false;
        }

        this.total = data.length;
        this.paginationEvent('enter', 1);  
    },
    paginationEvent: function(event, enterVal) {        
        if (event === 'next' && this.current + 1 <= this.total) {
            this.current += 1;
        } else if (event === 'prev' && this.current - 1 > 0) {
            this.current -= 1;
        } else if (event === 'enter'
            && enterVal && parseInt(enterVal) > 0 
            && parseInt(enterVal) <= this.total) {
            this.current = parseInt(enterVal);
        } else {
            alert('Invalid page.');
            return false;
        }

        this.setPagination();
        this.showCurrentView();
    },
    setPagination: function() {
        var _this = this;

        $('.pagination-number').text(_this.total);
        $('.viewer-current').val(_this.current);
    },
    isFileExist: function(url, callback) {
        $.get(url)
        .done(function() {
            callback(true);
        })
        .fail(function() {
            callback(false);
        });
    },
    showCurrentView: function() {
        var _this = this;

        if (!_this.current || _this.current - 1 < 0 || !_this.data) {
            alert('something went wrong.');
            return false;
        }

        if (!_this.data[_this.current - 1]) {
            alert('Invalid data provided.');
            return false;
        }

        _this.currentData = _this.data[_this.current - 1];

        var type = _this.getCurrentType(); // current file type

        if (_this.supportedImageType.indexOf(type) > -1) {
            _this.isFileExist(_this.currentData['url'], function(res) {
                if (res) {
                    _this.setImage();
                } else {
                    _this.setError("File not exist on given url.");
                }
            });
        } else if (_this.supportedPdfType.indexOf(type) > -1) {
            _this.setPdf();
        } else if (_this.supportedVideoType.indexOf(type) > -1) {
            _this.setVideo();
        } else {
            _this.setError('file type ' + type + ' not support by viewer.');
        }
    },
    getCurrentType: function() {
        var _this = this;
        
        if (!_this.currentData) {
            alert('something went wrong.');
            return false;
        }

        if (!_this.currentData['url'] || !_this.typeRex.exec(_this.currentData['url'])) {
            alert('Invalid data provided.');
            return false;
        }

        return _this.typeRex.exec(_this.currentData['url'])[1].toLowerCase();
    },
    setImage: function() {
        this.videoObj.removeClass('show').addClass('hide');
        this.pdfObj.removeClass('show').addClass('hide');
        this.errorObj.removeClass('show').addClass('hide');
        this.canvasElement.parent().removeClass('hide').addClass('show');

        var _this = this,
            img;

        if (_this.canvasImageObj && _this.canvasImageObj !== "") {
            img = document.createElement("img");
            img.src = _this.currentData['url'];

            $(img).on('load', function(e) {
                _this.canvasImageObj.setSrc(_this.currentData['url'], function() {
                    _this.canvasObj.renderAll();
                });
            });
        } else {
            img = document.createElement("img");
            img.src = _this.currentData['url'];

            $(img).on('load', function() {
                _this.canvasImageObj = new fabric.Image(img, {
                    centeredRotation: true,
                    centeredScaling: true,
                    hasBorders : false,
                    hasControls: false,
                    top: 0,
                    left: 0
                });

                _this.canvasObj.add(_this.canvasImageObj);
                _this.canvasObj.renderAll();
            });
        }
    },
    setPdf: function() {
        this.videoObj.removeClass('show').addClass('hide');
        this.canvasElement.parent().removeClass('show').addClass('hide');
        this.errorObj.removeClass('show').addClass('hide');
        this.pdfObj.removeClass('hide').addClass('show');

        this.pdfObj.attr('src', this.currentData['url']);
    },
    setVideo: function() {
        this.canvasElement.parent().removeClass('show').addClass('hide');
        this.pdfObj.removeClass('show').addClass('hide');
        this.errorObj.removeClass('show').addClass('hide');
        this.videoObj.removeClass('hide').addClass('show');

        this.videoObj[0].src = this.currentData['url'];
    },
    setError: function(msg) {
        this.canvasElement.parent().removeClass('show').addClass('hide');
        this.pdfObj.removeClass('show').addClass('hide');
        this.videoObj.removeClass('show').addClass('hide');

        if (msg) {
            this.errorObj.find('span').text(msg);
        }
        this.errorObj.removeClass('hide').addClass('show');
    }/*,
    appendLightboxDiv: function() {
        $(document.body)
        .append($('<div/>', { "class": "carouselLightboxOverlay"}))
        .append($('<div/>', { "class": "carouselLightboxDiv"}));

        var padTop = parseInt($('.carouselLightboxDiv').css('padding-top'));
        var padBottom = parseInt($('.carouselLightboxDiv').css('padding-bottom'));
        var padLeft = parseInt($('.carouselLightboxDiv').css('padding-left'));
        var padRight = parseInt($('.carouselLightboxDiv').css('padding-right'));

        var divTopPadding = padTop + padBottom;
        if (divTopPadding > 0)
        this.imgTopOffset = divTopPadding;

        var divLeftPadding = padLeft + padRight;
        if (divLeftPadding > 0)
        this.divLeftPadding = divLeftPadding;

    },
    openLightbox: function() {
        var _this = this;
        $(_this.baseClass).unbind('click').bind('click', function(e) {
            var container = $(".carouselLightboxAddLookbook");
            if ((!container.is(e.target)
            && container.has(e.target).length === 0)) {

                var offsets = $(this).offset();
                $('.carouselLightboxDiv')
                //.css('top', Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + 'px')
                .show();
                _this.setHtml(this);
            }
        });
    },
    setHtml: function(obj) {
        var _this = this;
        var imgUrl = $(obj).find('img').attr('src');

        var ImgTitle = "";
        if (typeof $(obj).find('img').attr('title') !== 'undefined')
        ImgTitle = $(obj).find('img').attr('title');

        _this.activeImageIndex = $(obj).find('img').attr('data-index');
        _this.totalImages = $(obj).parent().find(_this.baseClass).length;

        var imageOffset = $(obj).find('img').offset();
        _this.imgTopOffset = imageOffset.top;

        var img = new Image();
        img.onload = function() {
            var _imgThis = this;
            $('.carouselLightboxDiv').html("");

            if (this.width >= _this.maxWidth || this.height >= _this.maxHeight) {

                _this.getHeightWidthRatio(_imgThis.width, _imgThis.height, function(newWidth, newHeight){
                    _imgThis.width = parseInt(newWidth);
                    _imgThis.height = parseInt(newHeight);
                });
            }

            var scrollHeight = parseInt($(window).scrollTop());
            _this.imgTopOffset = Math.max(0, (($(window).height()/2)) + scrollHeight);
            //$('.carouselLightboxDiv').css('top',_this.imgTopOffset);

            $('.carouselLightboxDiv').animate({
                margin: -1* parseInt((_imgThis.height + (_this.divTopPadding))/2 - scrollHeight) +"px 0 0 " + -1*(_imgThis.width + (_this.divLeftPadding))/2 + "px",
                width: this.width,
                height: this.height
            }, 400, function() {
                var newHtml = "<span class='imgTitleCarouselLightbox'>"+ImgTitle+"</span>";
                newHtml += "<a class='closeCarouselLightbox' href='javascript:;'>&nbsp;</a>";
                newHtml += "<a class='carouselLightboxPrev' href='javascript:;'>&nbsp;</a>";
                newHtml += "<ul>";

                $(obj).parent(_this.parentClass).find(_this.baseClass).each(function(index) {
                    fullImgUrl = $(this).find('img').attr('src');

                    imgTitle = "";
                    if (typeof $(this).find('img').attr('title') !== 'undefined')
                    imgTitle = $(this).find('img').attr('title');

                    if (index == _this.activeImageIndex) {
                        newHtml += "<li class='active'><img data-imgtitle='"+ imgTitle +"' src='"+fullImgUrl+"' /></li>";
                    } else {
                        newHtml += "<li><img data-imgtitle='"+ imgTitle +"' src='"+fullImgUrl+"' /></li>";
                    }
                });
                newHtml += "</ul>";
                newHtml += "<a class='carouselLightboxNext' href='javascript:;'>&nbsp;</a>";

                $('.carouselLightboxDiv').html(newHtml);

                $('.carouselLightboxDiv ul li:eq('+_this.activeImageIndex+')')
                .css('height', parseInt(_imgThis.height)- (_this.divTopPadding*2)+'px');

                $('.carouselLightboxOverlay').show();

                _this.closeLightbox();
                _this.nextImage();
                _this.prevImage();
                _this.keyboardSupport();
            });
        }
        img.src = imgUrl;
    },
    keyboardSupport: function() {
        var _this = this;
        $(document).keydown(function(e){
            // do something when left arrow is pressed
            if (e.keyCode == 37) {
                if (_this.activeImageIndex <= 0) {
                    $('.carouselLightboxDiv .carouselLightboxPrev').addClass('hide');
                }

                if (_this.activeImageIndex < 0) {
                    $('.carouselLightboxDiv .carouselLightboxPrev').addClass('hide');
                } else {
                    $('.carouselLightboxDiv .carouselLightboxPrev').removeClass('hide');
                    $('.carouselLightboxDiv .imgTitleCarouselLightbox').text('');
                    _this.activeImageIndex = parseInt(_this.activeImageIndex) - 1;

                    $('.carouselLightboxDiv .carouselLightboxNext').removeClass('hide');
                }

                _this.showImage();
                _this.prevImage();

                return false;
            }

            // do something when right arrow is pressed
            if (e.keyCode == 39) {

               if (_this.totalImages -1 == _this.activeImageIndex) {
                   $('.carouselLightboxDiv .carouselLightboxNext').addClass('hide');
               }

               if (_this.totalImages -1 == _this.activeImageIndex) {
                   $('.carouselLightboxDiv .carouselLightboxNext').addClass('hide');
                   //_this.activeImageIndex = 0;
               } else {
                   $('.carouselLightboxDiv .carouselLightboxNext').removeClass('hide');
                   $('.carouselLightboxDiv .imgTitleCarouselLightbox').text('');
                   _this.activeImageIndex = parseInt(_this.activeImageIndex) + 1;

                   $('.carouselLightboxDiv .carouselLightboxPrev').removeClass('hide');
               }

               _this.showImage();
               _this.nextImage();
               return false;
            }
        });
    },
    nextImage: function() {
        var _this = this;

        if (_this.totalImages -1 == _this.activeImageIndex) {
            $('.carouselLightboxDiv .carouselLightboxNext').addClass('hide');
        }

        $('.carouselLightboxDiv .carouselLightboxNext').unbind('click').bind('click', function() {
            if (_this.totalImages -1 == _this.activeImageIndex) {
                $(this).addClass('hide');
                //_this.activeImageIndex = 0;
            } else {
                $(this).removeClass('hide');
                $('.carouselLightboxDiv .imgTitleCarouselLightbox').text('');
                _this.activeImageIndex = parseInt(_this.activeImageIndex) + 1;

                $('.carouselLightboxDiv .carouselLightboxPrev').removeClass('hide');
            }

            _this.showImage();
            _this.nextImage();
        });
    },
    prevImage: function() {
        var _this = this;

        if (_this.activeImageIndex <= 0) {
            $('.carouselLightboxDiv .carouselLightboxPrev').addClass('hide');
        }

        $('.carouselLightboxDiv .carouselLightboxPrev').unbind('click').bind('click', function() {
            if (_this.activeImageIndex < 0) {
                $(this).addClass('hide');
            } else {
                $(this).removeClass('hide');
                $('.carouselLightboxDiv .imgTitleCarouselLightbox').text('');
                _this.activeImageIndex = parseInt(_this.activeImageIndex) - 1;

                $('.carouselLightboxDiv .carouselLightboxNext').removeClass('hide');
            }

            _this.showImage();
            _this.prevImage();
        });
    },
    showImage: function() {
        var _this = this;
        currentImg = $('.carouselLightboxDiv ul li:eq('+_this.activeImageIndex+') img');

        $('.carouselLightboxDiv ul li').removeClass('active');

        var img = new Image();
        img.onload = function() {
            var _imgThis = this;
            var scrollHeight = parseInt($(window).scrollTop());

            if (this.width >= _this.maxWidth || this.height >= _this.maxHeight) {

                _this.getHeightWidthRatio(_imgThis.width, _imgThis.height, function(newWidth, newHeight){
                    _imgThis.width = parseInt(newWidth);
                    _imgThis.height = parseInt(newHeight);
                });

                //this.width = _this.maxWidth;
                //this.height = _this.maxHeight;
            }

            $('.carouselLightboxDiv ul li:eq('+_this.activeImageIndex+')')
            .css('height', parseInt(this.height) - (_this.divTopPadding)+'px');

            $('.carouselLightboxDiv').animate({
                margin: -1* parseInt((_imgThis.height+(_this.divTopPadding))/2 - scrollHeight) +"px 0 0 " + -1*(_imgThis.width+(_this.divLeftPadding))/2 + "px",
                width: this.width+"px",
                height: this.height+"px"
            }, 400, function() {
                ImgTitle = $('.carouselLightboxDiv ul li:eq('+_this.activeImageIndex+') img').attr('data-imgtitle');

                $('.carouselLightboxDiv .imgTitleCarouselLightbox').text(ImgTitle);
                $('.carouselLightboxDiv ul li:eq('+_this.activeImageIndex+')').addClass('active');
            });
        }
        img.src = currentImg.attr('src');
    },
    getHeightWidthRatio: function(imgWidth, imgHeight, callback) {
        var _this = this;

        if(imgWidth > _this.maxWidth){
            ratio = parseInt(_this.maxWidth) / parseInt(imgWidth);
            imgHeight = parseInt(imgHeight) * ratio;
            imgWidth = parseInt(imgWidth) * ratio;
        }

        if(imgHeight > _this.maxHeight){
            ratio = parseInt(_this.maxHeight) / parseInt(imgHeight);
            imgWidth = parseInt(imgWidth) * ratio;
            imgHeight = parseInt(imgHeight) * ratio;
        }

        callback(imgWidth, imgHeight);
    },
    closeLightbox: function() {
        var _this = this;
        $('.closeCarouselLightbox').unbind('click').bind('click', function() {
            $('.carouselLightboxOverlay, .carouselLightboxDiv').remove();
            _this.appendLightboxDiv();
        });


        $('.carouselLightboxOverlay').unbind('click').bind('click', function (e){
            var container = $(".carouselLightboxDiv");

            if ((!container.is(e.target)
            && container.has(e.target).length === 0)) {
                $('.carouselLightboxOverlay, .carouselLightboxDiv').remove();
                _this.appendLightboxDiv();
            }
        });
        //Lightbox will get close on esc key press.
        $(document).keyup(function(e) {
            if (e.keyCode == 27) { // escape key maps to keycode `27`
                $('.carouselLightboxOverlay, .carouselLightboxDiv').remove();
                _this.appendLightboxDiv();
            }
        });
    }*/
};
