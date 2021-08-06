import React, {Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import {
    faCalendarAlt,
    faInfoCircle,
    faMapPin, faUsers
} from "@fortawesome/free-solid-svg-icons";
import {getAllStates} from "easy-location-br";
import {DefaultProfile} from "../img";
import {isAuthenticated} from "../auth";
import FollowProfileButton from "./FollowProfileButton";
import {Box, Image, Text} from "@chakra-ui/core";

export default class FormatUser extends Component {

    constructor() {
        super();
        this.state = {
            user: {},
            isFollowing: false
        }
    };

    componentDidMount() {
        this.setState({
            user: this.props.user,
            isFollowing: this.checkFollow(this.props.user)
        });
    };

    checkFollow = user => {
        const jwt = isAuthenticated();
        return user.followers.find(follower => {
            return follower === jwt.user._id;
        });
    };

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.user._id).then(data => {
            if (data.error) {
                this.setState({error: data.error});
            } else {
                this.setState({user: data, isFollowing: !this.state.isFollowing});
            }
        });
    };

    getState = (id) => {
        const states = getAllStates();
        const state = states.filter(s => {
            return (s.id === id)
        });
        return state[0].name;
    };

    userCard(user, i) {
        const { name, followers, posts, _id, state, city } = this.state.user;
        const photoUrl = _id ? `${process.env.REACT_APP_API}/user/photo/${_id}?${new Date().getTime()}` : 'DefaultProfile';

        return <Box maxW="sm" borderWidth="1px" rounded="lg" overflow="hidden" m={3} p={2} borderColor={'gray.300'} key={i}>
            <div className="card-body">
                <Image
                    rounded="full"
                    size="150px"
                    src={photoUrl}
                    alt={name}
                    className="center"
                    fallbackSrc={DefaultProfile}
                />
                <div className="row">
                    <p className="col">
                        <Text fontSize="lg">{name}</Text>
                        <p className="text-muted">
                            <p className="text-muted">
                                {state || city ? (<>
                                    <FontAwesomeIcon icon={faMapPin} className="mr-1"/>
                                    {city} - {this.getState(state)}
                                    <br/>
                                </>) : <br/>}
                                <FontAwesomeIcon icon={faUsers} className="mr-1"/>
                                {followers ? followers.length : 0} Curtidas
                                <br/>
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1"/>
                                {posts ? posts.length : 0} Eventos
                                <br/>
                            </p>
                            <Link to={`user/${_id}`} className="btn btn-primary btn-raised mr-1"
                                  data-toggle="tooltip" data-placement="top" title="Detalhes">
                                <FontAwesomeIcon icon={faInfoCircle}/>
                            </Link>
                            {isAuthenticated().user &&
                            isAuthenticated().user._id === _id ? null :
                                <FollowProfileButton
                                    following={this.state.isFollowing}
                                    onButtonClick={this.clickFollowButton}
                                />
                            }
                        </p>
                    </p>
                </div>
            </div>
        </Box>
    }

    render() {
        const user = this.props.user;
        const index = this.props.index;
        return (this.userCard(user, index));
    }
};