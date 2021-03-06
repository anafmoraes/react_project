import React, {Component} from 'react';
import {isAuthenticated} from "../auth";
import {Default} from "react-spinners-css";
import {Redirect} from "react-router-dom";
import {create} from "./apiPost";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarDay,
    faCamera, faGlobe, faGlobeAmericas,
    faGripLines, faLaptop, faMapPin, faPaperPlane, faSignLanguage, faVideo
} from "@fortawesome/free-solid-svg-icons";
import {getTags} from '../tag/apiTag'
import Header from "../core/Header";
import {getAllStates, getStateCities} from "easy-location-br";
import {Heading, Select} from "@chakra-ui/core";

class NewPost extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            body: "",
            state: "",
            address: "",
            accessibility: "",
            postedBy: {},
            city: "",
            photo: "",
            error: "",
            success: "",
            redirectToPosts: false,
            loading: false,
            postData: "",
            fileSize: 0,
            loadingPhoto: false,
            cities: [],
            states: getAllStates(),
            tags: [],
        }
    }

    componentDidMount() {
        this.postData = new FormData();
        getTags(isAuthenticated().token).then(data => {
            if (!data.error) {
                this.setState({postedBy: isAuthenticated().user, tags: data});
            }
        }).catch(err => this.setState({error: err}));
        this.setState({postedBy: isAuthenticated().user});
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
            this.setState({error: "O t??tulo ?? obrigat??rio", loading: false});
            return false;
        }
        if (address.length === 0) {
            this.setState({error: "O endere??o ou link do evento ?? obrigat??rio", loading: false});
            return false;
        }
        if (!date) {
            this.setState({error: "A data ?? obrigat??ria", loading: false});
            return false;
        }
        if (!accessibility) {
            this.setState({error: "N??vel de acessibilidade ?? obrigat??rio", loading: false});
            return false;
        }
        if (body.length === 0) {
            this.setState({error: "A descri????o ?? obrigat??ria", loading: false});
            return false;
        }
        if (!fileSize) {
            this.setState({error: "A foto do evento ?? obrigat??ria", loading: false});
            return false;
        }
        if (fileSize > 1000000) {
            this.setState({error: "Foto deve ter menos de 1mb", loading: false});
            return false;
        }
        return true;
    };

    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        if (this.isValid()) {
            this.setState({loading: true});
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            create(userId, token, this.postData).then(data => {
                if (data.error) this.setState({error: data.error, loading: false});
                else {
                    this.setState({
                        success: "Evento cadastrado com sucesso",
                        redirectToPosts: true,
                        loading: false,
                        title: '',
                        body: '',
                        photo: ''
                    });
                }
            });
        }
    };

    newPostForm(post) {
        const {title, body, date, accessibility, isOnline, address, video, tag} = post;
        return <form className="form-group text-center">
            <div className="row center">
                <div className="col-md-8">
                    <div className="form-row">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="name" className="required">T??tulo</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                <span className="input-group-text">
                                        <FontAwesomeIcon icon={faGripLines}/>
                                </span>
                                </div>
                                <input type="text" className="form-control" name="title" placeholder="T??tulo do evento"
                                       autoFocus value={title} aria-describedby="title"
                                       onChange={this.handleChange("title")}
                                       required/>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="description" className="required">Descri????o</label>
                            <div className="input-group">
                                <textarea rows="4" className="form-control" name="description"
                                          value={body} aria-describedby="description"
                                          placeholder="Descri????o do evento"
                                          onChange={this.handleChange("body")}/>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="description" className="required">Categoria</label>
                            <div className="input-group">
                                <Select placeholder="Selecione uma categoria"
                                        value={tag}
                                        onChange={this.handleChange("tag")}>
                                    {this.state.tags?.map((tag) =>
                                        <option value={tag._id}>{tag.name}</option>)
                                    }
                                </Select>
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
                                       value={date} aria-describedby="date" id="date"
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
                                        onChange={this.handleChange("accessibility")}
                                        placeholder='Selecione uma acessibilidade'>
                                    <option>Selecione a acessibilidade</option>
                                    <option value="0">Pouco acess??vel</option>
                                    <option value="1">Acess??vel</option>
                                    <option value="2">Muito Acess??vel</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-row center">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="name" className="required">Foto</label>
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
                                    id="isOnline"
                                    name="isOnline"
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={isOnline}
                                    onChange={this.handleChange("isOnline")}/>
                                <label className="form-check-label" for="isOnline">
                                    <FontAwesomeIcon icon={faLaptop} className="mr-2"/>
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
                                <label htmlFor="name" className="required">Endere??o</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                <span className="input-group-text">
                                        <FontAwesomeIcon icon={faGlobe}/>
                                </span>
                                    </div>
                                    <input type="text" className="form-control" name="title"
                                           placeholder="Endere??o ou link do evento"
                                           value={address} aria-describedby="address"
                                           onChange={this.handleChange("address")}
                                           required/>
                                </div>
                            </div>
                            <div className="col-md-12 mb-3">
                                <label htmlFor="name">V??deo descritivo</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                <span className="input-group-text">
                                        <FontAwesomeIcon icon={faVideo}/>
                                </span>
                                    </div>
                                    <input type="text" className="form-control" name="video"
                                           placeholder="Link do v??deo do youtube descrevendo ou apresentado o evento"
                                           value={video} aria-describedby="video"
                                           onChange={this.handleChange("video")}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-group justify-content-center">
                            <button onClick={this.clickSubmit} type="submit" className="btn btn-success mb-5">
                                <FontAwesomeIcon icon={faPaperPlane}/> Salvar
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
        const {
            error, redirectToPosts, success, loading, title, body,
            state, city, date, isOnline, accessibility, address
        } = this.state;

        if (redirectToPosts) return <Redirect to={`/posts`}/>;
        return (
            <>
                <Header/>
                <section className="container">
                    <Heading as="h1" className="font-weight-light wrapper border-bottom">
                        <strong>Cadastro de evento</strong>
                    </Heading>
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{error}</div>
                    <div className="alert alert-success" style={{display: success ? "" : "none"}}>{success}</div>
                    <br/>
                    {loading ?
                        <div className="center"><Default/></div> :
                        this.newPostForm({
                            title, body, date, accessibility, isOnline,
                            address, state, city
                        })}
                </section>
            </>
        )
    }
}

export default NewPost;