import React from 'react';
import PropTypes from 'prop-types';
import { CONSTANT } from './../../constants/index';
import Next from './assets/skip-next-circle-outline.png';
import Prev from './assets/skip-previous-circle-outline.png';

class Pagination extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            current: 0
        };

        this.actionHandler = this.actionHandler.bind(this);
    }

    componentDidMount() {
        this.props.callback(this.state.current);
    }

    actionHandler(event, enterVal = 0) {
        let current;
        if (event === CONSTANT.EVENTS.NEXT && this.state.current + 1 < this.props.total) {
            current = this.state.current + 1;
        } else if (event === CONSTANT.EVENTS.PREV && this.state.current - 1 >= 0) {
            current = this.state.current - 1;
        } else if (event === CONSTANT.EVENTS.PREV && enterVal && parseInt(enterVal) > 0 && parseInt(enterVal) <= this.props.total) {
            current = parseInt(enterVal);
        } else {
            console.log('Invalid page.');
            return false;
        }

        this.setState({
            current
        }, () => {
            this.props.callback(current);
        });
    }

    render() {
        return (
            <div className="controls-pagination display-inline-block">
                <a href="javascript:;" className="prev" onClick={() => this.actionHandler(CONSTANT.EVENTS.PREV)}><img src={Prev} /></a>
                <input type="text" className="viewer-current" value={this.state.current + 1} />
                <div className="display-inline-block pagination-text">of <span className="pagination-number">{this.props.total}</span></div>
                <a href="javascript:;" className="next" onClick={() => this.actionHandler(CONSTANT.EVENTS.NEXT)}><img src={Next} /></a>
            </div>
        );
    }
}

Pagination.propTypes = {
    total: PropTypes.number,
    callback: PropTypes.func
};

Pagination.defaultProps = {
    total: 0,
    callback: () => { }
};

export default Pagination;
