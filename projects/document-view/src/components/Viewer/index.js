import React from 'react';
import PropTypes from 'prop-types';
import { CONSTANT } from './../../constants/index';
import DataService from './../../services/index';
import ImageViewer from './../ImageViewer/index';
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

        this.state = {
            totle: 0,
            currentIndex: 0,
            currentType: '',
            currentObj: ''
        };

        this.viewerDivRef = React.createRef();
        this.handelData = this.handelData.bind(this);
        this.renderView = this.renderView.bind(this);
    }

    componentWillUnmount() {
    }

    componentDidMount() {
        this.handelData(0);
    }

    handelData(currentIndex = 0) {
        if (this.props.options
            && this.props.options.data
            && this.props.options.data.length
            && currentIndex !== undefined
            && this.props.options.data[currentIndex]
            && this.props.options.data[currentIndex]['url']) {
            const currentType = DataService.getViewType(this.props.options.data[currentIndex]['url']);
            this.setState({
                currentIndex,
                currentType,
                currentObj: this.props.options.data[currentIndex]
            });
        } else {
            alert('No data found');
        }
    }

    renderActions() {
        console.log('this.props.options', this.props.options)
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

    errorHandler(error) {
        alert('Handel error here');
    }

    renderView() {
        if (this.state.currentType === CONSTANT.IMAGE_TYPE) {
            return (
                <ImageViewer data={this.state.currentObj} viewdiv={this.viewerDivRef} callback={this.errorHandler} />
            );
        }

        return null;
    }

    render() {
        return (
            <div className="main height-100 width-100">
                <div ref={this.viewerDivRef} className="main-div border-full width-100 height-90 padding-5">
                    {this.renderView()}
                </div>
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
