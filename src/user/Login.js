import React from "react";
import {Link, Redirect} from "react-router-dom";
import {Default} from 'react-spinners-css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEnvelope, faKey, faSignInAlt} from '@fortawesome/free-solid-svg-icons'
import Header from "../core/Header";import {Heading} from "@chakra-ui/core";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToRefer: false,
            loading: false
        };
    }

    handleChange = name => event => {
        this.setState({error: ""});
        this.setState({[name]: event.target.value})
    };

    authenticate(jwt, next) {
        if (typeof window !== "undefined") {
            localStorage.setItem("jwt", JSON.stringify(jwt));
            next();
        }
    };

    clickSubmit = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const {email, password} = this.state;
        const user = {email, password};
        this.login(user).then(data => {
            if (data.error)
                this.setState({error: data.error, loading: false});
            else {
                this.authenticate(data, () => {
                    this.setState({redirectToRefer: true});
                });
            }
        });
    };

    login = user => {
        return fetch(`${process.env.REACT_APP_API}/login`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Content-Length": "139",
                "Sec-Fetch-Dest": "empty",
                'Access-Control-Allow-Origin': 'http://localhost:8080',
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site"
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                return response.json();
            })
            .catch(err => console.log(err));
    };

    loginForm = () => {
        return <form className="form-group">
            <div className="form-row">
                <div className="col-md-12 mb-3">
                    <label htmlFor="email">Email</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                             <FontAwesomeIcon icon={faEnvelope}/>
                            </span>
                        </div>
                        <input onChange={this.handleChange("email")}
                               type="email" className="form-control" name="email"
                               placeholder="email@exemplo.com" autoFocus
                               aria-describedby="email" required value={this.state.email}/>
                    </div>
                </div>
            </div>
            <div className="form-row">
                <div className="col-md-12 mb-3">
                    <label htmlFor="password">Senha</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faKey}/>
                            </span>
                        </div>
                        <input onChange={this.handleChange("password")}
                               type="password"
                               className="form-control"
                               name="password" placeholder="******"
                               value={this.state.password}
                               aria-describedby="password" required/>
                    </div>
                </div>
            </div>
            <button onClick={this.clickSubmit} type="submit" className="btn btn-success text-white">
                <FontAwesomeIcon icon={faSignInAlt} className="mr-1"/>
                Entrar
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
                        Login
                    </strong></Heading>
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{error}</div>
                    {loading ? <Default/> : this.loginForm()}
                    <br/><Link to="/forgot-password">Esqueceu sua senha?</Link>
                    <div className="text-center">
                        Se não possui cadastro, <Link to="/signup"> cadastre-se aqui!</Link>
                    </div>
                    <br/>
                </section>
            </>
        )
    }
}