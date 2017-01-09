/**
 * Developer: Sanjay Verma
 * Email: skumarverma45@gmail.com
 * Version: 1.0
 */
var viewer = function(options) {
    //Default values
    this.parentElement = ".main-div";
    this.maxWidth = 2000;
    this.maxHeight = 2000;
    this.videoControl = false;
    this.data = [];
    this.zoomSpeed = 8;
    this.callback = function() {};
    $.extend(this, options);

    //custom values
    this.current = 1;
    this.currentData;
    this.currentType = 'image';
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
        if (!$(_this.parentElement).length) {
            alert('Element ' + _this.parentElement + ' not exist on page, but provided in viewer object');
            return false;
        }

        this.createCanvasObj(); //create canvas object for image viewer
        this.createVideoObj(); //create video object for video viewer
        this.createPdfObj(); //create video object for pdf viewer
        this.createErrorObj(); //create error object

        this.appendElements();
        this.setDynamicHeightWidth();
        this.isViewerReady = true;

        this.callback({ 'initialize': this.isViewerReady });
        this.setEvent();

        if (this.data && this.data.length) {
            this.setData(_this.data)
        }
    },
    createCanvasObj: function() {
        var _this = this;
        this.canvasElement = $('<canvas/>', { 'id': _this.canvasElementId });
    },
    createVideoObj: function() {
        var _this = this;
        this.videoObj = $('<video />', { 'controls': _this.videoControl, 'class': 'hide', 'width': '100%', 'height': '100%' })
            .append($('<source />', { 'type': 'video/mp4' }));
    },
    createPdfObj: function() {
        this.pdfObj = $('<iframe />', { 'scrolling': 'auto', 'class': 'hide', 'frameborder': 0, 'width': '100%', 'height': '100%' });
    },
    createErrorObj: function() {
        this.errorObj = $('<div />', { 'class': 'hide error-div height-100 width-100 text-center position-relative' })
            .append($('<span />', { 'class': 'position-absolute' }));
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
            if (e.which == 13 && $(this).val() !== "" && !isNaN(parseInt($(this).val()))) {
                _this.paginationEvent('enter', parseInt($(this).val()));
            } else {
                alert('Invalid page.');
            }
        });

        //if zoom spped provided wrong then it will set default value
        if (isNaN(_this.zoomSpeed) || _this.zoomSpeed >= 1 || _this.zoomSpeed <= 0) {
            _this.zoomSpeed = 8;
        }

        //mouse wheel event on canvas for zoom in/out effect
        $(_this.canvasObj.wrapperEl).on("mousewheel", function(event) {
            var currentMouseX = Math.round(event.clientX - _this.canvasObj._offset.left),
                currentMouseY = Math.round(event.clientY - _this.canvasObj._offset.top),
                delta = event.originalEvent.wheelDelta / 120;

            _this.setImageZoom(delta, currentMouseX, currentMouseY);
            event.preventDefault() && false;
        });

        //zoomIn event
        $('.zoomIn').unbind('click').bind('click', function() {
            _this.setImageZoom(1);
        });

        //zoomOut event
        $('.zoomOut').unbind('click').bind('click', function() {
            _this.setImageZoom(-1);
        });

        //image fit event
        $('.fit').unbind('click').bind('click', function() {
            _this.setImageFit();
        });

        //fullscreen event
        $('.full').unbind('click').bind('click', function() {
            _this.setFullScreen();
        });

        //set height/width after resize event
        var resizeId;
        $(window).resize(function() {
            clearTimeout(resizeId);
            if (_this.isViewerReady) {
                resizeId = setTimeout(function() {
                    _this.setDynamicHeightWidth(); //set dynamic height/width for parent div
                    _this.setImageFit(); //set height/width for canvas image object

                    if (!_this.pdfObj.hasClass('hide')) { //set height/width for pdf object
                        _this.pdfObj[0].contentDocument.location.reload(true);
                    }
                }, 500);
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
        } else if (event === 'enter' && enterVal && parseInt(enterVal) > 0 && parseInt(enterVal) <= this.total) {
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
                    _this.currentType = 'image';
                    _this.setImage();
                } else {
                    _this.setError("File not exist on given url.");
                }
            });
        } else if (_this.supportedPdfType.indexOf(type) > -1) {
            _this.currentType = 'pdf';
            _this.setPdf();
        } else if (_this.supportedVideoType.indexOf(type) > -1) {
            _this.currentType = 'video';
            _this.setVideo();
        } else {
            _this.currentType = 'error';
            _this.setError('file type ' + type + ' not support by viewer.');
        }
    },
    getCurrentType: function() {
        var _this = this;

        if (!_this.currentData) {
            //alert('something went wrong.');
            _this.setError('Data not exist for view.');
            return false;
        }

        if (!_this.currentData['url'] || !_this.typeRex.exec(_this.currentData['url'])) {
            _this.setError('Invalid data provided.');
            //alert('Invalid data provided.');
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
                    _this.setImageFit();
                });
            });
        } else {
            img = document.createElement("img");
            img.src = _this.currentData['url'];

            $(img).on('load', function() {
                _this.canvasImageObj = new fabric.Image(img, {
                    centeredRotation: true,
                    centeredScaling: true,
                    hasBorders: false,
                    hasControls: false,
                    top: 0,
                    left: 0
                });

                _this.canvasObj.add(_this.canvasImageObj);
                _this.setImageFit();
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
    },
    setImageFit: function() {
        if (this.currentType !== 'image') {
            return false;
        }

        var _this = this,
            scaleY = _this.canvasObj.height / _this.canvasImageObj.height,
            scaleX = _this.canvasObj.width / _this.canvasImageObj.width;

        if (scaleX > scaleY) {
            _this.canvasImageObj.scaleToHeight(_this.canvasObj.height);
        } else {
            _this.canvasImageObj.scaleToWidth(_this.canvasObj.width);
        }

        _this.canvasObj.centerObject(_this.canvasImageObj);
        _this.canvasObj.renderAll();
    },
    setImageZoom: function(delta, cMouseX, cMouseY) {
        if (this.currentType !== 'image') {
            return false;
        }

        var _this = this,
            factor = _this.zoomSpeed / 10;
        if (delta > 0) {
            factor = 1 / factor;
        }

        // Zoom into the image.
        _this.canvasImageObj.setScaleX(_this.canvasImageObj.getScaleX() * factor);
        _this.canvasImageObj.setScaleY(_this.canvasImageObj.getScaleY() * factor);

        // Calculate displacement of zooming position.
        var dx = (_this.canvasObj.width / 2 - _this.canvasImageObj.getLeft()) * (factor - 1), //default x position
            dy = (_this.canvasObj.height / 2 - _this.canvasImageObj.getTop()) * (factor - 1); //default y position
        if (cMouseX && cMouseY) {
            dx = (cMouseX - _this.canvasImageObj.getLeft()) * (factor - 1); //mouse x position
            dy = (cMouseY - _this.canvasImageObj.getTop()) * (factor - 1); //mouse y position
        }

        // Compensate for displacement.
        _this.canvasImageObj.setLeft(_this.canvasImageObj.getLeft() - dx);
        _this.canvasImageObj.setTop(_this.canvasImageObj.getTop() - dy);

        _this.canvasObj.renderAll();
    },
    setFullScreen: function() {
        var _this = this;
        // check full-screen available
        if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) {
            var element = $(_this.parentElement)[0]; // image container
            // check in full-screen mode or not
            if (document.fullscreenElement || document.webkitFullscreenElement ||
                document.mozFullScreenElement || document.msFullscreenElement
            ) {
                // exit from full-screen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                // enter in full-screen
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }
        }

    }
};
