import React from 'react';
import PropTypes from 'prop-types';
// import { CONSTANT } from '../../constants/index';

class DocViewer extends React.Component {
    constructor(props) {
        super(props);
        this.docRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.data && this.props.data.url) {
            this.setPdf(this.props.data.url);
        } else {
            this.props.callback({ 'error': 'Invalid url provided' });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.data.url) {
            this.setPdf(nextProps.data.url);
        } else {
            this.props.callback({ 'error': 'Invalid data provided' });
        }
    }

    setPdf(url) {
        if (url) {
            this.docRef.current.src = url;
        } else {
            this.props.callback({ 'error': 'Invalid url provided' });
        }
    }

    render() {
        return (
            <iframe scrolling="auto" frameborder="0" width="100%" height="100%" ref={this.docRef}></iframe>
        );
    }
}

DocViewer.propTypes = {
    data: PropTypes.object,
    viewdiv: PropTypes.any,
    callback: PropTypes.func
};

DocViewer.defaultProps = {
    data: {
        url: '',
        title: ''
    },
    viewdiv: '',
    callback: () => { }
};

export default DocViewer;
