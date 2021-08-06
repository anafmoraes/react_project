import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEnvelope} from '@fortawesome/free-solid-svg-icons'
import Header from "../core/Header";
import {Heading} from "@chakra-ui/core";

export default class ForgotPassword extends React.Component {
    state = {
        email: "",
        message: "",
        error: ""
    };

    forgotPasswordReq = email => {
        return fetch(`${process.env.REACT_APP_API}/forgot-password`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Content-Length": "139",
                "Sec-Fetch-Dest": "empty",
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site"
            },
            body: JSON.stringify({email})
        })
            .then(response => {
                return response.json();
            })
            .catch(err => console.log(err));
    };

    forgotPassword = e => {
        e.preventDefault();
        this.setState({message: "", error: ""});
        this.forgotPasswordReq(this.state.email).then(data => {
            if (data.error) {
                this.setState({error: data.error});
            } else {
                this.setState({message: data.message});
            }
        });
    };

    render() {
        return (
            <>
                <Header/>
                <section className="container wrapper fadeInDown col-sm" id="formContent">
                    <Heading as="h2" className="font-weight-light mb-3"><strong>
                        Redefinir senha
                    </strong></Heading>
                    <div className="alert alert-danger"
                         style={{display: this.state.error ? "" : "none"}}>{this.state.error}</div>
                    <div className="alert alert-success"
                         style={{display: this.state.message ? "" : "none"}}>{this.state.message}</div>
                    <br/>
                    <form className="form-group">
                        <div className="form-row">
                            <div className="col-md-12 mb-3">
                                <label for="email">Email</label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faEnvelope}/>
                                    </span>
                                    </div>
                                    <input type="email" className="form-control" id="email"
                                           placeholder="email@exemplo.com"
                                           value={this.state.email}
                                           aria-describedby="email"
                                           onChange={e =>
                                               this.setState({
                                                   email: e.target.value,
                                                   message: "",
                                                   error: ""
                                               })
                                           }
                                           autoFocus
                                           required/>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={this.forgotPassword}
                            className="btn btn-success text-white">
                            Enviar email
                        </button>
                    </form>
                </section>
            </>
        );
    }
}