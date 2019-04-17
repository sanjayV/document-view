import React from 'react';
import PropTypes from 'prop-types';
// import { CONSTANT } from '../../constants/index';

class VideoViewer extends React.Component {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.data && this.props.data.url) {
            this.setVideo(this.props.data.url);
        } else {
            this.props.callback({ 'error': 'Invalid url provided' });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.data.url) {
            this.setVideo(nextProps.data.url);
        } else {
            this.props.callback({ 'error': 'Invalid data provided' });
        }
    }

    setVideo(url) {
        if (url) {
            this.videoRef.current.src = url;
        } else {
            this.props.callback({ 'error': 'Invalid url provided' });
        }
    }

    render() {
        return (
            <video controls={this.props.controls} width="100%" height="100%" ref={this.videoRef}>
                <source type="video/mp4"></source>
            </video>
        );
    }
}

VideoViewer.propTypes = {
    data: PropTypes.object,
    viewdiv: PropTypes.any,
    controls: PropTypes.bool,
    callback: PropTypes.func
};

VideoViewer.defaultProps = {
    data: {
        url: '',
        title: ''
    },
    viewdiv: '',
    controls: true,
    callback: () => { }
};

export default VideoViewer;
