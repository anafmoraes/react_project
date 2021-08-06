import React, {Component} from 'react';
import {
    faCalendarAlt,
    faComment,
    faHeart, faMapPin, faPencilAlt,
    faStar, faVideo
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Default} from "react-spinners-css";
import {singlePost, rating} from "./apiPost";
import {isAuthenticated} from "../auth";
import {Link, Redirect} from "react-router-dom";
import {DefaultProfile} from "../img";
import Header from "../core/Header";import {getAllStates} from "easy-location-br";
import LikePostButton from "./LikePostButton";
import ScheduleButton from "./ScheduleButton";
import Comment from "./Comment";
import {Heading, Image} from "@chakra-ui/core";
import BeautyStars from 'beauty-stars';

export class Post extends Component {
    state = {
        post: '',
        error: "",
        success: "",
        redirectToPosts: false,
        redirectToLogin: false,
        loading: false,
        like: false,
        likes: [],
        comments: [],
        schedule: false,
        rating: 0,
        average: 0
    };

    componentDidMount() {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        singlePost(postId, token).then(data => {
            if (data.error) {
                this.setState({redirectToLogin: true});
            } else {
                const like = this.checkLike(data);
                const schedule = this.checkSchedule(data);
                const rating = this.checkRate(data);
                this.setState({
                    like,
                    schedule,
                    rating: rating.rate,
                    post: data,
                    likes: data.likes,
                    comments: data.comments,
                    average: data.rating.reduce((t, n) => n.rate+t, 0)/data.rating.length || 0
                });
            }
        }).catch(err => this.setState({error: err}));
    };

    updateComments = comments => {
        this.setState({comments});
    };

    checkLike = post => {
        const jwt = isAuthenticated();
        return post.likes.find(like => {
            return like === jwt.user._id;
        });
    };

    checkRate = post => {
        const jwt = isAuthenticated();
        post.rating.find(r => {
            if (r.postedBy === jwt.user._id)
                return r.rate;
        });
        return 0;
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
                console.log("user", user);
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

    accessibility(accessibility) {
        if (accessibility === 0)
            return <span className="badge badge-pill badge-danger mb-4">Pouco acessível</span>;
        if (accessibility === 1)
            return <span className="badge badge-pill badge-secondary mb-4">Acessível</span>;
        if (accessibility === 2)
            return <span className="badge badge-pill badge-success mb-4">Muito acessível</span>;
    }

    getState = (id) => {
        const states = getAllStates();
        const state = states.filter(s => {
            return (s.id === id)
        });
        return state[0].name;
    };

    renderTop = post => {
        const user = post.postedBy;
        const photoUrl = user._id ? `${process.env.REACT_APP_API}/user/photo/${user._id}?${new Date().getTime()}` : 'DefaultProfile';
        return <>
            <div className="row">
                <figure className="flex-item text-right mr-3 mt-3">
                    <img className="img-rounded img-responsive rounded-circle"
                         src={photoUrl} alt={user.name} width="50" height="50"
                         onError={i => (i.target.src = `${DefaultProfile}`)}/>
                </figure>
                <div className="align-items-baseline mt-3">
                    Criado por {user.name} <br/>
                </div>
            </div>

            {isAuthenticated().user._id === user._id ? (
                    <div className="btn-group btn-group-md float-right" role="group" aria-label="...">
                        <Link to={`edit/${post._id}`}
                              className="btn btn-primary btn-sm mr-2">
                            <FontAwesomeIcon icon={faPencilAlt} className="mr-1"/>
                            Editar Evento
                        </Link>
                    </div>
                ) :
                (
                    <>
                        <div className="btn-group btn-group-md float-right" role="group" aria-label="...">
                            <LikePostButton
                                like={this.state.like}
                                onButtonClick={this.clickLikeButton}/>
                            <a href="#comment" className="btn btn-primary mr-1 rounded">
                                <FontAwesomeIcon icon={faComment}/>
                            </a>
                            <ScheduleButton
                                schedule={this.state.schedule}
                                onButtonClick={this.clickScheduleButton}/>
                            <a href="#rate" className="btn btn-warning mr-1 text-white rounded">
                                <FontAwesomeIcon icon={faStar}/>
                            </a>
                        </div>
                    </>
                )
            }

        </>
    };

    renderDetails = post => {
        return <>
            <div className="card col-12">
                <div className="card-body">
                    {post.date ? (
                        <p className="text-muted d-block">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1"/>
                            {new Date(post.date).toLocaleDateString('pt-BR', {
                                hour: 'numeric',
                                minute: 'numeric',
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>) : null}
                    <br/>
                    {post.isOnline ? (
                        <p className="text-muted">
                            <FontAwesomeIcon icon={faMapPin} className="mr-1"/>
                            Evento Online:
                            {post.address ? (
                                <a target="_blank" rel="noopener noreferrer" href={post.address}> link de
                                    acesso</a>) : null}
                        </p>
                    ) : (
                        <p className="text-muted">
                            <FontAwesomeIcon icon={faMapPin} className="mr-1"/>
                            {post.address ? ` ${post.address}` : null}
                            {post.city ? ` ${post.city} ` : null}
                            {post.state ? ` - ${this.getState(post.state)}` : null}
                        </p>
                    )}
                    {post.video ? (
                        <p className="text-muted">
                            <FontAwesomeIcon icon={faVideo} className="mr-1"/>
                            <a target="_blank" rel="noopener noreferrer" href={post.video}> Vídeo do evento </a>
                        </p>
                    ) : null}
                    {this.accessibility(post.accessibility)}
                    <span className="badge badge-pill badge-warning m-2">{post.tag?.name}</span>
                    <p className="text-muted">
                        <FontAwesomeIcon icon={faHeart} className="mr-1"/>
                        {post.likes.length} Curtidas
                    </p>
                    <p className="text-muted">
                        <FontAwesomeIcon icon={faComment} className="mr-1"/>
                        {this.state.comments.length} Comentários
                    </p>
                    <p className="text-muted">
                        <FontAwesomeIcon icon={faStar} className="mr-1"/>
                        {this.state.average} Estrelas
                    </p>
                    {post.body ? (
                        <>
                            <p className="lead">Detalhes</p>
                            <p className="text-muted">{post.body}</p>
                        </>
                    ) : null}
                    {post.photo ? (
                        <Image size="auto"
                               mt={5}
                               src={`${process.env.REACT_APP_API}/post/photo/${post._id}?${new Date().getTime()}`}
                               alt={post.title} />
                    ) : null}
                </div>
            </div>
        </>
    };

    sendRate = value => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.state.post._id;
        rating(userId, token, postId, value)
            .then(data => {
                if (data.error)
                    console.log(data.error);
                else {
                    this.setState({
                        average: data.rating.reduce((t, n) => n.rate+t, 0)/data.rating.length} || 0)
                }
            })
    };

    rating(){
        return <div className="card col-lg-12 col-md-12 col-sm-12 center p-3" id="rate">
            <p className="lead">Avaliar evento</p>
            <BeautyStars
                className="mb-4"
                value={this.state.rating}
                activeColor="#FFED76"
                size="50px"
                onChange={value => {
                    this.setState({rating: value});
                    this.sendRate(value)
                }}
            />
        </div>
    }

    render() {
        const {error, success, post, redirectToPosts, redirectToLogin, comments} = this.state;
        if (redirectToPosts) {
            return <Redirect to={`/posts`}/>;
        } else if (redirectToLogin) {
            return <Redirect to={`/login`}/>;
        }
        return (
            <>
                <Header/>
                {!post ? (<div className="center"><Default/></div>) :
                    (
                        <>
                            <div className="jumbotron bg-light">
                                <div className="container">
                                    <Heading as="h1"
                                             className="font-weight-light wrapper"><strong> {post.title} </strong></Heading>
                                    <div className="alert alert-danger"
                                         style={{display: error ? "" : "none"}}>{error}</div>
                                    <div className="alert alert-success"
                                         style={{display: success ? "" : "none"}}>{success}</div>
                                    {this.renderTop(post)}
                                </div>
                            </div>
                            <section className="container justify-content-md-center">
                                {this.renderDetails(post)}
                                {/*categorias*/}
                                {this.rating()}
                                <Comment postId={post._id} comments={comments} updateComments={this.updateComments}/>
                            </section>
                        </>
                    )
                }
            </>
        );
    }
}