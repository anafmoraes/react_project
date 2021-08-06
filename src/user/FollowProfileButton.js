import React, {Component} from 'react';
import {follow, unfollow} from '../auth'
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {faHeart as farHeart} from '@fortawesome/free-regular-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class FollowProfileButton extends Component {

    followClick = () => {
        this.props.onButtonClick(follow);
    };

    unfollowClick = () => {
        this.props.onButtonClick(unfollow);
    };

    render() {
        return (
            <div className="d-inline-block">
                {
                    !this.props.following ?
                        <button onClick={this.followClick}
                                className="btn btn-outline-danger btn-raised mr-1 custom-button"
                                data-toggle="tooltip" data-placement="top" title="Curtir">
                            <FontAwesomeIcon icon={farHeart}/>
                        </button>
                        : <button onClick={this.unfollowClick}
                                  className="btn btn-danger btn-raised mr-1 custom-button"
                                  data-toggle="tooltip" data-placement="top" title="Descurtir">
                            <FontAwesomeIcon icon={faHeart}/>
                        </button>
                }
            </div>
        );
    }
};