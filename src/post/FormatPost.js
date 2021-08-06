import React, {Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import {
    faComment, faGlobeAmericas,
    faHeart,
    faInfoCircle,
    faMapMarkerAlt,
    faMapPin, faStar
} from "@fortawesome/free-solid-svg-icons";
import {getAllStates} from "easy-location-br";
import {isAuthenticated} from "../auth";
import LikePostButton from "./LikePostButton";
import ScheduleButton from "./ScheduleButton";
import {Image, Box} from "@chakra-ui/core";

export default class FormatPost extends Component {

    constructor() {
        super();
        this.state = {
            post: {},
            like: false,
            schedule: false
        }
    };

    componentDidMount() {
        this.setState({
            post: this.props.post,
            like: this.checkLike(this.props.post),
            schedule: this.checkSchedule(this.props.post)
        });
    };

    checkLike = post => {
        const jwt = isAuthenticated();
        return post.likes.find(like => {
            return like === jwt.user._id || like._id === jwt.user._id;
        });
    };

    checkSchedule = post => {
        const jwt = isAuthenticated();
        return jwt.user.schedule.find(myPost => {
            return post._id === myPost;
        });
    };

    clickLikeButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.post._id).then(data => {
            if (data.error) {
                this.setState({error: data.error});
            } else {
                this.setState({post: data, like: !this.state.like});
            }
        });
    };

    clickScheduleButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.post._id).then(user => {
            if (user.error) {
                this.setState({error: user.error});
            } else {
                this.setState({schedule: !this.state.schedule});
                this.updateUser(user, () => {
                    this.setState({
                        loading: false,
                        success: "Agenda atualizada"
                    })
                });
            }
        });
    };

    updateUser = (user, next) => {
        if (typeof window !== "undefined") {
            if (localStorage.getItem('jwt')) {
                let auth = JSON.parse(localStorage.getItem('jwt'));
                auth.user = user;
                localStorage.setItem('jwt', JSON.stringify(auth));
                next();
            }
        }
    };

    getState = (id) => {
        const states = getAllStates();
        const state = states.filter(s => {
            return (s.id === id)
        });
        return state[0] ? state[0].name : "";
    };

    accessibility(accessibility) {
        if (accessibility === 0)
            return <span className="badge badge-pill badge-danger">Pouco acessível</span>;
        if (accessibility === 1)
            return <span className="badge badge-pill badge-secondary">Acessível</span>;
        if (accessibility === 2)
            return <span className="badge badge-pill badge-success">Muito acessível</span>;
    }

    postCard() {
        const post = this.state.post;
        const {date, accessibility, isOnline, title, likes, comments, _id} = post;
        return <Box maxW="sm" borderWidth="1px" rounded="lg" overflow="hidden" m={3} p={2} borderColor={'gray.300'}>
            <Image size='auto'
                   margin='auto'
                   objectFit="cover"
                   src={`${process.env.REACT_APP_API}/post/photo/${post._id}`}
                   alt={post.title}
                   fallbackSrc='https://via.placeholder.com/200'/>
            <Box p="6">
                <Box d="flex" alignItems="baseline">
                    {this.accessibility(accessibility)}
                    {isOnline ? <span className="badge badge-pill badge-light mr-1">Online</span> :
                        <span className="badge badge-pill badge-light">Presencial</span>}
                </Box>

                <Box mt="1"
                     fontWeight="semibold"
                     lineHeight="tight"
                     isTruncated>
                    {title}
                </Box>

                <Box as="span" color="gray.600" fontSize="sm">
                    {new Date(date).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Box>
            </Box>
            <Box d="inline" m="2" alignItems="center">
                <FontAwesomeIcon icon={faHeart} color='red'/>
                <Box as="span" ml="2" color="gray.600" fontSize="sm">
                    {likes?.length} Curtidas
                </Box>
            </Box>
            <Box d="inline" m="2" alignItems="center">
                <FontAwesomeIcon icon={faComment} color='blue'/>
                <Box as="span" ml="2" color="gray.600" fontSize="sm">
                    {comments?.length} Comentários
                </Box>
            </Box>
            <Box d="block" m="2" alignItems="center">
                <Link to={`/post/${_id}`} className="btn btn-primary m-1">
                    <FontAwesomeIcon icon={faInfoCircle}/>
                </Link>
                <LikePostButton
                    like={this.state.like}
                    onButtonClick={this.clickLikeButton}/>
                <ScheduleButton
                    schedule={this.state.schedule}
                    onButtonClick={this.clickScheduleButton}/>
            </Box>
        </Box>
    }

    postCardOld() {
        const post = this.state.post;
        const {date, accessibility, isOnline, title, body, likes, comments, _id, address, city, state} = post;
        return <div className="card col-lg-5 mb-5">
            <div className="card-body">
                <div className="text-muted text-right">
                    {new Date(date).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                    <br/>
                    {
                        post.postedBy?.name && post.postedBy?._id ? <p className="font-italic m-1 text-right">
                            Postado por <Link to={`user/${post.postedBy._id}`}>
                            {post.postedBy.name}
                        </Link>
                        </p> : null
                    }
                    {this.accessibility(accessibility)}
                    {isOnline ? <span className="badge badge-pill badge-light mr-1">Online</span> :
                        <span className="badge badge-pill badge-light">Presencial</span>}
                </div>
                <h5 className="card-title">{title}</h5>
                <div className="row">
                    <div className="col">
                        <p className="card-text">
                            {body ? body.substring(0, 100) : ''}...
                        </p>
                        <p className="text-muted">
                            <FontAwesomeIcon icon={faHeart} className="mr-1"/>
                            {likes?.length} Curtidas
                            <br/>
                            <FontAwesomeIcon icon={faComment} className="mr-1"/>
                            {comments?.length} Comentários
                            <br/>
                            {isOnline ? (
                                <p className="text-muted">
                                    <FontAwesomeIcon icon={faMapPin} className="mr-1"/>
                                    {address ? (<a target="_blank" rel="noopener noreferrer" href={address}>
                                        Link de acesso</a>) : null}
                                </p>
                            ) : (
                                <p className="text-muted">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1"/>
                                    {address ? `${address}` : null}
                                    <br/>
                                    <FontAwesomeIcon icon={faGlobeAmericas} className="mr-1"/>
                                    {city ? ` ${city} - ${this.getState(state)}` : this.getState(state)}
                                </p>
                            )}
                            {/*    <?php */}
                            {/*    if(!$event->isOnline){*/}
                            {/*    echo '<i class="fa fa-map-pin" aria-hidden="true"></i> ';*/}
                            {/*    if (isset($event->city)) echo $event->city;*/}
                            {/*    echo " - ";*/}
                            {/*    if (isset($event->state)) echo $event->state;*/}
                            {/*}*/}
                            {/*?> <br/>*/}
                        </p>
                        <Link to={`/post/${_id}`} className="btn btn-primary m-1">
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-1"/>
                        </Link>
                        <LikePostButton
                            like={this.state.like}
                            onButtonClick={this.clickLikeButton}/>
                        <ScheduleButton
                            schedule={this.state.schedule}
                            onButtonClick={this.clickScheduleButton}/>
                    </div>
                </div>
            </div>
        </div>
    }

    render() {
        return this.postCard();
    }
};