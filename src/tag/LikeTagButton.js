import React, {Component} from 'react';
import {like, unlike} from './apiTag'
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {faHeart as farHeart} from '@fortawesome/free-regular-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class LikeTagButton extends Component {

    likeClick = () => {
        this.props.onButtonClick(like);
    };

    unlikeClick = () => {
        this.props.onButtonClick(unlike);
    };

    render() {
        return (
            <div className="d-inline-block">
                {
                    !this.props.like ?
                        <button onClick={this.likeClick}
                                className="btn btn-outline-danger btn-raised mr-1 custom-button"
                                data-toggle="tooltip" data-placement="top" title="Curtir">
                            <FontAwesomeIcon icon={farHeart}/>
                        </button>
                        : <button onClick={this.unlikeClick} className="btn btn-danger btn-raised mr-1 custom-button"
                                  data-toggle="tooltip" data-placement="top" title="Descurtir">
                            <FontAwesomeIcon icon={faHeart}/>
                        </button>
                }
            </div>
        );
    }
};