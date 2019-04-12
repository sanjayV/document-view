import React from 'react';
import PropTypes from 'prop-types';
import { CONSTANT } from '../../constants/index';
import './style.css'
import PlusCircle from './assets/plus-circle-outline.png';
import MinusCircle from './assets/minus-circle-outline.png';
import FullScreen from './assets/fullscreen.png';
import FullScreenExit from './assets/fullscreen-exit.png';
import Next from './assets/skip-next-circle-outline.png';
import Prev from './assets/skip-previous-circle-outline.png';

class Viewer extends React.Component {
    constructor(...props) {
        super(...props);
    }

    componentWillUnmount() {
    }

    renderActions() {
        console.log('this.props.options',this.props.options)
        return (
            <div className="controls-div border-full width-100 height-10">
                <div className="controls-div-inner">
                    <div className="controls-tool display-inline-block">
                        <a title="Zoom In" href="javascript:;" className="zoomIn"><img src={PlusCircle} /></a>
                        <a title="Zoom Out" href="javascript:;" className="zoomOut"><img src={MinusCircle} /></a>
                        <a title="Full Screen" href="javascript:;" className="full"><img src={FullScreen} /></a>
                        <a title="Fit Screen" href="javascript:;" className="fit"><img src={FullScreenExit} /></a>
                    </div>
                    <div className="controls-pagination display-inline-block">
                        <a href="javascript:;" className="prev"><img src={Prev} /></a>
                        <input type="text" className="viewer-current" value="1" />
                        <div className="display-inline-block pagination-text">of <span className="pagination-number">1</span></div>
                        <a href="javascript:;" className="next"><img src={Next} /></a>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="main height-100 width-100">
                <div className="main-div border-full width-100 height-90 padding-5"> </div>
                {this.renderActions()}
            </div>
        );
    }
}

Viewer.propTypes = {
    options: PropTypes.object
};

Viewer.defaultProps = {
    options: {
        ...CONSTANT.DEFAULT_OPTIONS
    }
};

export default Viewer;
