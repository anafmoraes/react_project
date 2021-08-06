import React, {Component} from 'react';
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class Pagination extends Component {

    loadMore = number => {
        this.props.changePage(this.props.page + number);
        this.props.load(this.props.page + number);
    };

    loadLess = number => {
        this.props.changePage(this.props.page - number);
        this.props.load(this.props.page - number);
    };

    render() {
        const {page, limit, objs, totalItems} = this.props;
        return (
            <div className="center">
                {page > 1 ? (
                    <button
                        className="btn btn-raised btn-success mr-5 mt-5 mb-5 rounded-circle"
                        onClick={() => this.loadLess(1)}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </button>
                ) : ("")}
                {objs.length && totalItems - (objs.length + limit * (page - 1)) !== 0 ? (
                    <button
                        className="btn btn-raised btn-success mt-5 mb-5 rounded-circle"
                        onClick={() => this.loadMore(1)}>
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </button>
                ) : ("")}
            </div>
        );
    }
};