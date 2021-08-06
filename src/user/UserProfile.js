import React from 'react';
import {isAuthenticated} from "../auth";
import {Link, Redirect} from 'react-router-dom'
import {DefaultProfile} from "../img";
import FollowProfileButton from "./FollowProfileButton";
import Header from "../core/Header";
import {listByUser} from "../post/apiPost";
import FormatPost from "../post/FormatPost";
import {Heading, Image, Badge, Divider} from "@chakra-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faMapPin} from "@fortawesome/free-solid-svg-icons";
import {getAllStates} from "easy-location-br";
import {Default} from "react-spinners-css";

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {following: [], followers: []},
            error: "",
            redirectToLogin: false,
            following: false,
            posts: [],
            loading: false
        }
    };

    checkFollow = user => {
        const jwt = isAuthenticated();
        return user.followers.find(follower => {
            return follower._id === jwt.user._id;
        });
    };

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        callApi(userId, token, this.state.user._id).then(data => {
            if (data.error) {
                this.setState({error: data.error});
            } else {
                this.setState({user: data, following: !this.state.following});
            }
        });
    };

    read = (userId, token) => {
        return fetch(`${process.env.REACT_APP_API}/user/${userId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Content-Length": "139",
                "Sec-Fetch-Dest": "empty",
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "Authorization": `Bearer ${token}`
            },
        }).then(response => {
            return response.json();
        }).catch(err => console.log(err));
    };

    init = userId => {
        const token = isAuthenticated().token;
        this.setState({loading: true});
        this.read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({redirectToLogin: true});
                } else {
                    const following = this.checkFollow(data);
                    this.setState({user: data, following, loading: false});
                    this.loadPosts(data._id, token);
                }
            })
            .catch(err => this.setState({error: err}));
    };

    loadPosts = (userId, token) => {
        listByUser(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({redirectToLogin: true});
                } else {
                    this.setState({posts: data});
                }
            })
            .catch(err => this.setState({error: err}));
    };

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
    };

    getState = (id) => {
        const states = getAllStates();
        const state = states.filter(s => {
            return (s.id === id)
        });
        return state[0].name;
    };

    render() {
        const {error, posts, loading} = this.state;
        const {name, email, isAdmin, _id, city, state, isDeaf} = this.state.user;
        const redirectLogin = this.state.redirectToLogin;
        if (redirectLogin) return <Redirect to="/login"/>;
        const photoUrl = _id
            ? `${process.env.REACT_APP_API}/user/photo/${_id}?${new Date().getTime()}`
            : 'DefaultProfile';
        return (
            <>
                <Header/>
                <div className="container">
                    <Heading as="h1" className="font-weight-light wrapper"><strong> {name} </strong></Heading>
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{this.error}</div>
                    <br/>
                    {
                        loading ?
                            <div className="center"><Default/></div> :
                            <div className="row center">
                                <div className="col-3">
                                    <Image
                                        rounded="full"
                                        size="150px"
                                        src={photoUrl}
                                        alt={name}
                                        className="center"
                                        fallbackSrc={DefaultProfile}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <p><FontAwesomeIcon icon={faEnvelope} className="mr-1"/> {email} </p>
                                    {state || city ? (<>
                                        <FontAwesomeIcon icon={faMapPin} className="mr-1"/>
                                        {city} - {this.getState(state)}
                                        <br/>
                                    </>) : <br/>}
                                    {isAdmin ?
                                        <Badge variantColor="green" m={2}>Administrador</Badge>:
                                        <Badge variantColor="purple" m={2}>Usuário comum</Badge>
                                    }
                                    {isDeaf ?
                                        <Badge variantColor="green" m={2}>Surdo</Badge>:
                                        <Badge variantColor="purple" m={2}>Ouvinte</Badge>
                                    }
                                    <br/>
                                    {isAuthenticated().user &&
                                    isAuthenticated().user._id === _id ? (
                                        <div className="d-inline-block">
                                            <Link
                                                className="btn btn-raised btn-success mr-5"
                                                to={`/user/edit/${_id}`}
                                            >
                                                Editar perfil
                                            </Link>
                                        </div>
                                    ) : <FollowProfileButton
                                        following={this.state.following}
                                        onButtonClick={this.clickFollowButton}
                                    />}
                                </div>
                            </div>
                    }
                    <Divider borderColor="gray.400" mt={2}/>
                    <section className="row center">
                        {posts && posts.length > 0 ? (
                            <Heading className="font-weight-light wrapper border-bottom"><strong> Eventos </strong></Heading>
                        ) : ''}
                        {posts.map((post, i) => <FormatPost post={post} index={i}/>)}
                    </section>
                </div>
            </>
        )
    }
}