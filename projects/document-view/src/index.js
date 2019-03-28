import React from 'react';
import { render } from 'react-dom';
import { CONSTANT } from './constants/index'
import Viewer from './components/Viewer';

const defaultOptions = {
    'containerId': 'root',
    'onComplete': () => { }
};

let options = {};

class DocumentView {
    constructor(opts) {
        options = {
            ...defaultOptions,
            ...opts
        };

        this.child = React.createRef();
        this.renderTemplate();
    }

    clearState() {
        this.child.current.clearState();
    }

    sendFileObject(res) {
        options.onComplete(res);
    }

    setStyle() {
        return null;
    }

    renderTemplate() {
        render(
            <div className="viewer-main">
                <style>
                    {this.setStyle()}
                </style>
                <Viewer />
            </div>,
            document.getElementById(options.containerId)
        )
    }
}

(window).DocumentView = DocumentView;
export { DocumentView };
export default DocumentView;
