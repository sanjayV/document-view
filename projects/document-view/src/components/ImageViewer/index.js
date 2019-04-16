import React from 'react';
import PropTypes from 'prop-types';
import { CONSTANT } from '../../constants/index';

const styles = {
    canvas: {
        width: 500,
        height: 500
    }
};

class ImageViewer extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentWillMount() {
        if (this.props.viewdiv && this.props.viewdiv.current) {
            styles.canvas['width'] = +this.props.viewdiv.current.clientWidth - 10; // remove padding from width
            styles.canvas['height'] = +this.props.viewdiv.current.clientHeight - 10; // remove padding from height
        }
    }

    componentDidMount() {
        if (this.props.data && this.props.data.url) {
            this.setImage(this.props.data.url);
        } else {
            this.props.callback({ 'error': 'Invalid url provided' });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.data.url) {
            this.setImage(nextProps.data.url);
        } else {
            this.props.callback({ 'error': 'Invalid data provided' });
        }
    }

    setImage(url) {
        if (url) {
            const imageObj = new Image();
            imageObj.onload = () => {
                this.setImageFit(imageObj);
            };
            imageObj.src = url;
        } else {
            this.props.callback({ 'error': 'Invalid url provided' });
        }
    }

    setImageFit(imageObj) {
        var imageDimensionRatio = imageObj.width / imageObj.height;
        var canvasDimensionRatio = styles.canvas.width / styles.canvas.height;
        var renderableHeight, renderableWidth, xStart, yStart;
        if (imageDimensionRatio < canvasDimensionRatio) {
            renderableHeight = styles.canvas.height;
            renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
            xStart = (styles.canvas.width - renderableWidth) / 2;
            yStart = 0;
        } else if (imageDimensionRatio > canvasDimensionRatio) {
            renderableWidth = styles.canvas.width
            renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
            xStart = 0;
            yStart = (styles.canvas.height - renderableHeight) / 2;
        } else {
            renderableHeight = styles.canvas.height;
            renderableWidth = styles.canvas.width;
            xStart = 0;
            yStart = 0;
        }

        this.canvasRef.current.getContext("2d").clearRect(0, 0, styles.canvas.width, styles.canvas.height);
        this.canvasRef.current.getContext("2d").drawImage(imageObj, xStart, yStart, renderableWidth, renderableHeight);
    }

    render() {
        return (
            <div>
                <canvas width={styles.canvas.width} height={styles.canvas.height} ref={this.canvasRef} id="image-viewer-div"></canvas>
            </div>
        );
    }
}

ImageViewer.propTypes = {
    data: PropTypes.object,
    viewdiv: PropTypes.any,
    callback: PropTypes.func
};

ImageViewer.defaultProps = {
    data: {
        url: '',
        title: ''
    },
    viewdiv: '',
    callback: () => { }
};

export default ImageViewer;