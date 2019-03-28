import React from 'react';
import PropTypes from 'prop-types';
import DocumentView from 'document-view';
import { CONSTANT } from '../../constants/index'
import './style.css'

export default class Document extends React.Component {
    constructor(...props) {
        super(...props);
    }

    componentDidMount() {
        const documentViewObj = new DocumentView({
            containerId: 'document-viewer',
            onComplete: this.documentViewerCallback
        });
    }

    documentViewerCallback = (res) => {
        console.log('document viewer response => ', res);
    }

    render() {
        return (
            <div className="document-viewer-demo">
                Document View Demo
                <div id="document-viewer">
                </div>
            </div>
        );
    }
}

Document.propTypes = {
}

Document.defaultProps = {
}
