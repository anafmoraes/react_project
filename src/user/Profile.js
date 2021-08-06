import React from 'react';
import {isAuthenticated} from "../auth";
import { Redirect} from "react-router-dom";
import {Default} from "react-spinners-css";
import {DefaultProfile} from "../img";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBriefcase, faDeaf,
    faEnvelope,
    faGlobe,
    faKey,
    faMapMarker, faPaperPlane, faPlus,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import Header from "../core/Header";
import {getAllStates, getStateCities} from "easy-location-br";
import {Button, Heading, Image, Box, PseudoBox} from "@chakra-ui/core";

export default class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            state: "",
            city: "",
            occupation: "",
            photo: "",
            created: "",
            error: "",
            success: "",
            redirectToUsers: false,
            password: "",
            passwordConfirm: "",
            isDeaf: false,
            loading: false,
            userData: "",
            fileSize: 0,
            loadingPhoto: false,
            states: [],
            selectedState: '',
            cities: [],
        };
    }

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
        this.setState({states: getAllStates()});
        this.read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({redirectToUsers: true});
                } else {
                    this.setState({
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        occupation: data.occupation,
                        city: data.city,
                        state: data.state,
                        isDeaf: data.isDeaf,
                    });
                    if (data.state) this.setState({cities: getStateCities(data.state)});
                    this.updateUser(data, () => {
                        this.setState({
                            redirectToUsers: false,
                            loading: false,
                        })
                    });
                }
            })
            .catch(err => this.setState({error: err}));
    };

    componentDidMount() {
        this.userData = new FormData();
        const userId = this.props.match.params.userId;
        this.init(userId);
    };

    handleChange = name => event => {
        if (name === 'state') this.setState({cities: getStateCities(event.target.value)});
        this.setState({error: "", success: ""});
        const value = name === 'isDeaf' ? event.target.checked :
            name === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = name === 'photo' && event.target.files[0] ? event.target.files[0].size : 0;
        this.userData.set(name, value);
        this.setState({[name]: value, fileSize});
    };

    isValid = () => {
        const {name, password, fileSize} = this.state;
        if (name.length === 0) {
            this.setState({error: "O Nome é obrigatório", loading: false});
            return false;
        }
        if (fileSize > 900000) {
            this.setState({error: "Foto de perfil deve ter menos de 900kb", loading: false});
            return false;
        }
        if (password.length >= 1 && password.length <= 5) {
            this.setState({error: "A senha deve ter no mínimo 6 caracteres", loading: false});
            return false;
        }
        return true;
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

    clickSubmit = (event) => {
        event.preventDefault();
        if (this.isValid()) {
            this.setState({loading: true});
            const {password, passwordConfirm} = this.state;
            if (password !== passwordConfirm)
                return this.setState({error: "A senha e a confirmação de senha devem ser iguais", loading: false});
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
            this.update(userId, token, this.userData).then(data => {
                if (data.error) this.setState({error: data.error, loading: false});
                else {
                    this.updateUser(data, () => {
                        this.setState({
                            redirectToUsers: false,
                            loading: false,
                            success: "Dados atualizados com sucesso"
                        })
                    });
                }
            });
        }
    };

    requireAdmin = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const userId = this.props.match.params.userId;
        const token = isAuthenticated().token;
        this.sendReq(userId, token).then(data => {
            if (data.error) this.setState({error: data.error, loading: false});
            else {
                this.updateUser(data, () => {
                    this.setState({
                        redirectToUsers: false,
                        loading: false,
                        success: "Solicitação enviada"
                    })
                });
            }
        });

    }

    update(userId, token, user) {
        return fetch(`${process.env.REACT_APP_API}/user/${userId}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Content-Length": "139",
                "Sec-Fetch-Dest": "empty",
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "Authorization": `Bearer ${token}`
            },
            body: user
        })
            .then(response => {
                return response.json();
            })
            .catch(err => console.log(err));
    };

    sendReq(userId, token) {
        return fetch(`${process.env.REACT_APP_API}/user/requireAdmin/${userId}`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Content-Length": "139",
                "Sec-Fetch-Dest": "empty",
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                return response.json();
            })
            .catch(err => console.log(err));
    };

    editForm(id, name, email, state, city, occupation, isDeaf) {
        const photoUrl = id ? `${process.env.REACT_APP_API}/user/photo/${id}?${new Date().getTime()}` : 'DefaultProfile';
        const {states, cities} = this.state;
        return <form className="form-group text-center">
            <div className="row">
                <div className="center row col-md-4">
                    <Image
                        rounded="full"
                        size="150px"
                        src={photoUrl}
                        alt={name}
                        className="center"
                        fallbackSrc={DefaultProfile}
                    />
                    <input type="file" accept="image/*" className="form-control" name="photo"
                           placeholder="Foto de perfil"
                           aria-describedby="photo" onChange={this.handleChange("photo")}/>

                </div>
                <div className="col-md-8">
                    <div className="form-row">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="name" className="required">Nome</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faUser}/>
                                </span>
                                </div>
                                <input type="text" className="form-control" name="name" placeholder="Nome"
                                       autoFocus value={name} aria-describedby="name"
                                       onChange={this.handleChange("name")}
                                       required/>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="email">Email</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faEnvelope}/>
                                    </span>
                                </div>
                                <input type="email" className="form-control" name="email"
                                       value={email} aria-describedby="email" onChange={this.handleChange("email")}
                                       disabled/>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="password" className="required">Senha</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faKey}/>
                                    </span>
                                </div>
                                <input type="password" className="form-control" name="password"
                                       placeholder="******" onChange={this.handleChange("password")}
                                       aria-describedby="password" required/>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="password" className="required">Confirmação de senha</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faKey}/>
                                    </span>
                                </div>
                                <input type="password" className="form-control" name="password2"
                                       placeholder="******" onChange={this.handleChange("passwordConfirm")}
                                       aria-describedby="password2" required/>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="state">Estado</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faGlobe}/>
                                    </span>
                                </div>
                                <select id="state" name="state" className="form-control"
                                        onChange={this.handleChange("state")}>
                                    <option>Selecione um estado</option>
                                    {states.map(s => {
                                        return <option value={s.id} selected={s.id === state}>{s.name}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="city">Cidade</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faMapMarker}/>
                                    </span>
                                </div>
                                <select id="city" name="city" className="form-control"
                                        onChange={this.handleChange("city")}>
                                    <option>Selecione uma cidade</option>
                                    {cities.map((c) => {
                                        return <option value={c.name} selected={c.name === city}> {c.name} </option>
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="work">Ocupação</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faBriefcase}/>
                                    </span>
                                </div>
                                <input type="text" className="form-control" id="occupation"
                                       name="occupation" value={occupation}
                                       onChange={this.handleChange("occupation")}
                                       placeholder="Ocupação"
                                       aria-describedby="work"/>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-12 mb-3 offset-2">
                            <div className="input-group">
                                <FontAwesomeIcon icon={faDeaf}/>
                                <input checked={isDeaf} type="checkbox" name="isDeaf" id="isDeaf"
                                       className="form-check-input" value={this.state.isDeaf}
                                       onChange={this.handleChange("isDeaf")}/>
                                <label className="form-check-label" for="isDeaf"> Sou surdo </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-group justify-content-center">
                            <button onClick={this.clickSubmit} type="submit" className="btn btn-success mb-5">
                                <FontAwesomeIcon icon={faPaperPlane} className="mr-1"/>
                                Salvar
                            </button>
                            <br/>
                        </div>
                    </div>
                </div>
            </div>

        </form>
    };

    render() {
        const {id, name, email, state, city, occupation, error, redirectToUsers, success, loading, isDeaf} = this.state;
        if (redirectToUsers) return <Redirect to={`/users`}/>;
        return (
            <>
                <Header/>
                <section className="container">
                    <Heading className="font-weight-light wrapper border-bottom"><strong>Meu Perfil</strong>
                    </Heading>
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{error}</div>
                    <div className="alert alert-success" style={{display: success ? "" : "none"}}>{success}</div>
                    <br/>
                    {loading ?
                        <div className="center"><Default/></div> :
                        this.editForm(id, name, email, state, city, occupation, isDeaf)
                    }
                    {!isAuthenticated().user.isAdmin &&
                        (
                            isAuthenticated().user.requireAdmin ?
                                <Box bg="gray.400" p={4} color="black">
                                    Quero ser um administrador
                                    <Button ml={4} isDisabled={true}>Solicitação enviada</Button>
                                </Box> :
                                <Box bg="gray.400" p={4} color="black">
                                    Quero ser um administrador
                                    <Button ml={4} onClick={this.requireAdmin}>Enviar solicitação</Button>
                                </Box>
                        )

                    }
                </section>
            </>
        )
    }
}