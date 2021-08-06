import React from "react";
import {Redirect, Link} from "react-router-dom";
import {Default} from "react-spinners-css";
import {signup, login, authenticate} from '../auth'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBriefcase,
    faDeaf,
    faEnvelope,
    faGlobe,
    faKey,
    faMapMarker,
    faPaperPlane,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import Header from "../core/Header";import {getAllStates, getStateCities} from "easy-location-br";
import {Heading} from "@chakra-ui/core";

export default class Signup extends React.Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            passwordConfirm: "",
            isDeaf: true,
            occupation: "",
            error: "",
            redirectToRefer: false,
            loading: false,
            cities: [],
            states: getAllStates(),
            city: "",
            state: ""
        };
    }

    handleChange = name => event => {
        if (name === 'state') this.setState({cities: getStateCities(event.target.value)});
        const value = event.target.name === 'isDeaf' ? event.target.checked :
            event.target.value;
        this.setState({error: ""});
        this.setState({[name]: value})
    };

    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const {name, email, password, occupation, passwordConfirm, isDeaf, state, city} = this.state;
        const user = {name, email, password, occupation, isDeaf, city, state};
        if (password !== passwordConfirm)
            return this.setState({error: "A senha e a confirmação de senha devem ser iguais", loading: false});
        signup(user).then(data => {
            if (data.error) this.setState({error: data.error, loading: false});
            else {
                login({email, password}).then(data => {
                    authenticate(data, () => {
                        this.setState({redirectToRefer: true});
                    });
                });
            }
        });
    };

    signupForm = () => {
        return <form className="form-group">
            <div className="form-row">
                <div className="col-md-12 mb-3">
                    <label htmlFor="name" className="required">Nome</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faUser}/>
                            </span>
                        </div>
                        <input
                            onChange={this.handleChange("name")}
                            type="text"
                            name="name"
                            autoFocus
                            aria-describedby="name"
                            required
                            placeholder="Nome"
                            className="form-control"
                            value={this.state.name}
                        />
                    </div>
                </div>
            </div>
            <div className="form-row">
                <div className="col-md-12 mb-3">
                    <label htmlFor="email" className="required">Email</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faEnvelope}/>
                            </span>
                        </div>
                        <input onChange={this.handleChange("email")}
                               type="email"
                               className="form-control"
                               placeholder="email@exemplo.com"
                               aria-describedby="email"
                               name="email"
                               value={this.state.email}
                               required/>
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
                        <input onChange={this.handleChange("password")}
                               type="password"
                               className="form-control"
                               name="password"
                               placeholder="******"
                               value={this.state.password}
                               aria-describedby="password"
                               required/>
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
                        <input onChange={this.handleChange("passwordConfirm")}
                               type="password"
                               className="form-control"
                               name="passwordConfirm"
                               placeholder="******"
                               value={this.state.passwordConfirm}
                               aria-describedby="passwordConfirm"
                               required/>
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
                                <FontAwesomeIcon icon={faMapMarker}/>
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
            <div className="form-row">
                <div className="col-md-12 mb-3">
                    <label htmlFor="occupation">Ocupação</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faBriefcase}/>
                            </span>
                        </div>
                        <input onChange={this.handleChange("occupation")} type="text" className="form-control"
                               name="occupation" placeholder="Estudante"
                               aria-describedby="occupation" value={this.state.occupation}
                        />
                    </div>
                </div>
            </div>
            <div className="form-row">
                <div className="col-md-12 mb-3">
                    <div className="input-group">
                        <FontAwesomeIcon icon={faDeaf}/>
                        <input
                            id="isDeaf"
                            onChange={this.handleChange("isDeaf")}
                            type="checkbox"
                            className="form-check-input"
                            checked={this.state.isDeaf}
                            name="isDeaf"
                            value={this.state.isDeaf}
                        />
                        <label for="isDeaf" className="form-check-label">  Sou surdo </label>
                    </div>
                </div>
            </div>
            <button onClick={this.clickSubmit} type="submit" className="btn btn-success text-white">
                <FontAwesomeIcon icon={faPaperPlane} className="mr-1"/>
                Salvar
            </button>
        </form>
    };

    render() {
        const {error, redirectToRefer, loading} = this.state;
        if (redirectToRefer) return <Redirect to="/"/>;
        return (
            <>
                <Header/>
                <section className="container wrapper fadeInDown col-sm" id="formContent">
                    <Heading as="h2" className="font-weight-light mb-3"><strong>
                        Cadastro de usuário
                    </strong></Heading>
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{error}</div>
                    {loading ? <Default/> : this.signupForm()}
                    <div className="text-center">
                        Tem uma conta? <Link to="/login">Entre aqui!</Link>
                    </div>
                    <br/>
                </section>
            </>
        )
    }
}