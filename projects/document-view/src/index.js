import React from 'react';
import { render } from 'react-dom';
import { CONSTANT } from './constants/index'
import Viewer from './components/Viewer';

class DocumentView {
    options = {};

    constructor(opts) {
        this.child = React.createRef();
        this.options = {
            ...CONSTANT.DEFAULT_OPTIONS,
            ...opts
        };

        this.renderTemplate();
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
                <Viewer options={this.options} />
            </div>,
            document.getElementById(this.options.containerId)
        )
    }
}

(window).DocumentView = DocumentView;
export { DocumentView };
export default DocumentView;
