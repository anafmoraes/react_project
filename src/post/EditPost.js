import React, {Component} from 'react';
import {isAuthenticated} from "../auth";
import {Default} from "react-spinners-css";
import {Redirect} from "react-router-dom";
import {edit, singlePost} from "./apiPost";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarDay,
    faCamera, faGlobe, faGlobeAmericas,
    faGripLines, faLaptop, faMapPin, faSignLanguage, faVideo
} from "@fortawesome/free-solid-svg-icons";
import Header from "../core/Header";
import {getAllStates, getStateCities} from "easy-location-br";
import {Heading} from "@chakra-ui/core";

class EditPost extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            body: "",
            state: "",
            address: "",
            accessibility: "",
            city: "",
            photo: "",
            isOnline: false,
            video: "",
            postedBy: {},
            post: {},
            error: "",
            success: "",
            redirectToPosts: false,
            loading: false,
            postData: "",
            fileSize: 0,
            loadingPhoto: false,
            cities: [],
            states: getAllStates(),
        }
    }

    componentDidMount() {
        this.postData = new FormData();
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        singlePost(postId, token).then(data => {
            if (data.error) {
                this.setState({error: data.error});
            } else {
                const {title, body, state, city, accessibility, address, isOnline, video, _id, date} = data;
                this.setState({
                    title,
                    body,
                    state,
                    address,
                    accessibility,
                    city,
                    isOnline,
                    video,
                    _id,
                    date,
                    likes: data.likes.length,
                    comments: data.comments
                });
                this.setState({states: getAllStates()});
                this.setState({postedBy: isAuthenticated().user});
                if(data.state) this.setState({cities: getStateCities(data.state)});
            }
        }).catch(err => this.setState({error: err}));
    };

    handleChange = name => event => {
        if (name === 'state') this.setState({cities: getStateCities(event.target.value)});
        this.setState({error: "", success: ""});
        const value = event.target.name === 'isOnline' ? event.target.checked :
            name === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = name === 'photo' && event.target.files[0] ? event.target.files[0].size : 0;
        this.postData.set(name, value);
        this.setState({[name]: value, fileSize});
    };

    isValid = () => {
        const {fileSize, title, body, date, accessibility, address} = this.state;
        if (title.length === 0) {
            this.setState({error: "O título é obrigatório", loading: false});
            return false;
        }
        if (address.length === 0) {
            this.setState({error: "O endereço ou link do evento é obrigatório", loading: false});
            return false;
        }
        if (!date) {
            this.setState({error: "A data é obrigatória", loading: false});
            return false;
        }
        if (!accessibility) {
            this.setState({error: "Nível de acessibilidade é obrigatório", loading: false});
            return false;
        }
        if (body.length === 0) {
            this.setState({error: "A descrição é obrigatória", loading: false});
            return false;
        }
        if (fileSize > 300000) {
            this.setState({error: "Foto deve ter menos de 300kb", loading: false});
            return false;
        }
        return true;
    };

    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        if (this.isValid()) {
            this.setState({loading: true});
            const token = isAuthenticated().token;
            const postId = this.props.match.params.postId;
            edit(postId, token, this.postData).then(data => {
                if (data.error) this.setState({error: data.error, loading: false});
                else {
                    this.setState({
                        loading: false,
                        redirectToPost: true
                    });
                }
            });
        }
    };

    newPostForm = post => {
        const {title, body, date, accessibility, isOnline, address, video} = post;
        return <form className="form-group text-center">
            <div className="row center">
                <div className="col-md-8">
                    <div className="form-row">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="name" className="required">Título</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                <span className="input-group-text">
                                        <FontAwesomeIcon icon={faGripLines}/>
                                </span>
                                </div>
                                <input type="text" className="form-control" name="title" placeholder="Título do evento"
                                       autoFocus value={title} aria-describedby="title"
                                       onChange={this.handleChange("title")}
                                       required/>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="description" className="required">Descrição</label>
                            <div className="input-group">
                                <textarea rows="4" className="form-control" name="description"
                                          value={body} aria-describedby="description"
                                          placeholder="Descrição do evento"
                                          onChange={this.handleChange("body")}/>
                            </div>
                        </div>
                    </div>
                    <div className="form-row center">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="description" className="required">Data</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                            <FontAwesomeIcon icon={faCalendarDay}/>
                                    </span>
                                </div>
                                <input type="datetime-local" className="form-control" name="date"
                                       value={(date || '').toString().substring(0, 16)} aria-describedby="date"
                                       onChange={this.handleChange("date")}/>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="description" className="required">Acessibilidade</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                            <FontAwesomeIcon icon={faSignLanguage}/>
                                    </span>
                                </div>
                                <select className="form-control" value={accessibility}
                                        onChange={this.handleChange("accessibility")}>
                                    <option value="0">Pouco acessível</option>
                                    <option value="1">Acessível</option>
                                    <option value="2">Muito Acessível</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-row center">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="name">Foto</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                <span className="input-group-text">
                                        <FontAwesomeIcon icon={faCamera}/>
                                </span>
                                </div>
                                <input type="file" accept="image/*" className="form-control" name="photo"
                                       placeholder="Foto da postagem"
                                       aria-describedby="photo" onChange={this.handleChange("photo")}/>
                            </div>
                        </div>
                        <div className="col-md-12 mb-3">
                            <label htmlFor="name"/>
                            <div className="input-group mb-3 ml-5">
                                <input
                                    name="isOnline"
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={isOnline}
                                    onChange={this.handleChange("isOnline")}/>
                                <label className="form-check-label" htmlFor="isOnline">
                                    <FontAwesomeIcon icon={faLaptop} className="mr-1"/>
                                    Evento online
                                </label>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="state">Estado</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faGlobeAmericas}/>
                                    </span>
                                        </div>
                                        <select id="state" name="state" className="form-control"
                                                onChange={this.handleChange("state")}>
                                            <option>Selecione um estado</option>
                                            {this.state.states.map(s => {
                                                return <option value={s.id}>{s.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="city">Cidade</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faMapPin}/>
                                            </span>
                                        </div>
                                        <select id="city" name="city" className="form-control"
                                                onChange={this.handleChange("city")}>
                                            <option>Selecione uma cidade</option>
                                            {this.state.cities.map((c) => {
                                                return <option value={c.name}> {c.name} </option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 mb-3">
                                <label htmlFor="name" className="required">Endereço</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                <span className="input-group-text">
                                        <FontAwesomeIcon icon={faGlobe}/>
                                </span>
                                    </div>
                                    <input type="text" className="form-control" name="title"
                                           placeholder="Endereço ou link do evento"
                                           value={address} aria-describedby="address"
                                           onChange={this.handleChange("address")}
                                           required/>
                                </div>
                            </div>
                            <div className="col-md-12 mb-3">
                                <label htmlFor="name">Vídeo descritivo</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                <span className="input-group-text">
                                        <FontAwesomeIcon icon={faVideo}/>
                                </span>
                                    </div>
                                    <input type="text" className="form-control" name="video"
                                           placeholder="Link do vídeo do youtube descrevendo ou apresentado o evento"
                                           value={video} aria-describedby="video"
                                           onChange={this.handleChange("video")}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-group justify-content-center">
                            <button onClick={this.clickSubmit} type="submit" className="btn btn-success mb-5">
                                <i className="fas fa-paper-plane"/>Salvar
                            </button>
                            <br/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    };

    render() {
        if (!isAuthenticated().user.isAdmin)
            return <Redirect to={`/posts`}/>;
        const {error, redirectToPost, success, loading, title, body,
            date, accessibility, isOnline, address, video, _id} = this.state;

        if (redirectToPost) return <Redirect to={`/post/${_id}`}/>;
        return (
            <>
                <Header/>
                <section className="container">
                    <Heading as="h1" className="font-weight-light wrapper border-bottom">
                        <strong>Edição de evento</strong>
                    </Heading>
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{error}</div>
                    <div className="alert alert-success" style={{display: success ? "" : "none"}}>{success}</div>
                    <br/>
                    {loading ?
                        <div className="center"><Default/></div> :
                        this.newPostForm({title, body, date, accessibility, isOnline, address, video})}
                </section>
            </>
        )
    }
}

export default EditPost;