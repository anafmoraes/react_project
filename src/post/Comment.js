import React, {Component} from 'react';
import {faPaperPlane, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {comment, uncomment} from "./apiPost";
import {Link} from "react-router-dom";
import {isAuthenticated} from "../auth";
import {DefaultProfile} from "../img";
import {Image} from "@chakra-ui/core";

export default class Comment extends Component {
    state = {
        text: "",
        error: ""
    };

    handleChange = event => {
        this.setState({error: ""});
        this.setState({text: event.target.value});
    };

    isValid = () => {
        const {text} = this.state;
        if (!text.length > 0 || text.length > 150) {
            this.setState({
                error:
                    "O comentário deve ter entre 1 e 150 caracteres"
            });
            return false;
        }
        return true;
    };

    formatComment = comment => {
        const {created, text, postedBy} = comment;
        const photoUrl = postedBy._id ? `${process.env.REACT_APP_API}/user/photo/${postedBy._id}` : 'DefaultProfile';
        return (
            <div className="card-body bg-light m-1">
                <p className="text-muted text-right">
                    {new Date(created).toLocaleDateString('pt-BR', {
                        hour: 'numeric',
                        minute: 'numeric',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
                <div className="row">
                    <Image
                        rounded="full"
                        size="60px"
                        src={photoUrl}
                        alt={postedBy.name}
                        className="center mr-3 ml-2"
                        fallbackSrc={DefaultProfile}
                    />
                    <p className="text-muted">
                        <Link className="d-block" to={`/user/${postedBy._id}`}>
                            <strong> {postedBy.name} </strong>
                        </Link>
                        {text}
                    </p>

                </div>
                {isAuthenticated().user &&
                isAuthenticated().user._id === postedBy._id && (
                    <button onClick={() => this.deleteConfirmed(comment)}
                            className="btn btn-sm btn-outline-danger float-right">
                        <FontAwesomeIcon icon={faTrash}/>
                    </button>
                )}
            </div>

        )
    };

    addComment = e => {
        e.preventDefault();
        if (!isAuthenticated()) {
            this.setState({error: "Faça login para comentar"});
            return false;
        }
        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const postId = this.props.postId;
            const token = isAuthenticated().token;
            comment(userId, token, postId, {text: this.state.text})
                .then(data => {
                    if (data.error)
                        console.log(data.error);
                    else {
                        this.setState({text: ''});
                        this.props.updateComments(data.comments);
                    }
                })
        }
    };

    deleteComment = comment => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.props.postId;

        uncomment(userId, token, postId, comment).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.props.updateComments(data.comments);
            }
        });
    };

    deleteConfirmed = comment => {
        let answer = window.confirm(
            "Quer apagar o comentário?"
        );
        if (answer) {
            this.deleteComment(comment);
        }
    };

    render() {
        const {comments} = this.props;
        const {error} = this.state;
        const photoUrl = isAuthenticated().user._id ? `${process.env.REACT_APP_API}/user/photo/${isAuthenticated().user._id}` : 'DefaultProfile';
        return (
            <div className="card col-lg-12 col-md-12 col-sm-12 p-3">
                <p className="lead">Comentários</p>
                <div className="card-body bg-light m-2" id="comment">
                    <div className="row">
                        <Image
                            rounded="full"
                            size="60px"
                            src={photoUrl}
                            alt="Foto de perfil"
                            className="center mr-3 ml-2"
                            fallbackSrc={DefaultProfile}
                        />
                        <div className="col-10">
                            {error ? (<div className="alert alert-danger"> {error} </div>) : null}
                            <label> <strong>{isAuthenticated().user.name}</strong></label>
                            <form onSubmit={this.addComment} className="form-row center">
                                <div className="col-lg-10 col-md-12 col-sm-12">
                                    <input type="text" className="form-control" placeholder="Escreva um comentário"
                                           name="text" onChange={this.handleChange} value={this.state.text}/>
                                </div>
                                <button className="btn btn-outline-success" type="submit" name="send-comment" aria-label="Envio de comentário">
                                    <FontAwesomeIcon icon={faPaperPlane}/>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                {comments.reverse().map(c => this.formatComment(c))}
            </div>
        );
    }
}