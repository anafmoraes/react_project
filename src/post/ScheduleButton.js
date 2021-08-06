import React, {Component} from 'react';
import {schedule, unschedule} from './apiPost'
import {faBookmark} from "@fortawesome/free-solid-svg-icons";
import {faBookmark as farBookmark} from '@fortawesome/free-regular-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class ScheduleButton extends Component {

    scheduleClick = () => {
        this.props.onButtonClick(schedule);
    };

    unscheduleClick = () => {
        this.props.onButtonClick(unschedule);
    };

    render() {
        return (
            <div className="d-inline-block">
                {
                    !this.props.schedule ?
                        <button onClick={this.scheduleClick} className="btn btn-md btn-success mr-1" aria-label="Salvar na agenda">
                            <FontAwesomeIcon icon={farBookmark}/>
                        </button>
                        : <button onClick={this.unscheduleClick} className="btn btn-md btn-success mr-1" aria-label="Remover da agenda">
                            <FontAwesomeIcon icon={faBookmark}/>
                        </button>
                }
            </div>
        );
    }
};