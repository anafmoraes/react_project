import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faKey} from "@fortawesome/free-solid-svg-icons";
import Header from "../core/Header";
import {Heading} from "@chakra-ui/core";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            newPasswordConfirm: "",
            message: "",
            error: ""
        };
    };

    resetPasswordReq = resetInfo => {
        return fetch(`${process.env.REACT_APP_API}/reset-password`, {
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
            body: JSON.stringify(resetInfo)
        })
            .then(response => {
                console.log("forgot password response: ", response);
                return response.json();
            })
            .catch(err => console.log(err));
    };

    resetPassword = e => {
        e.preventDefault();
        this.setState({message: "", error: ""});
        if(this.state.newPassword !== this.state.newPasswordConfirm)
            return this.setState({error: "A senha e a confirmação de senha devem ser iguais"});
        this.resetPasswordReq({
            newPassword: this.state.newPassword,
            resetPasswordLink: this.props.match.params.resetPasswordToken
        }).then(data => {
            if (data.error) {
                this.setState({error: data.error});
            } else {
                this.setState({message: data.message, newPassword: "", newPasswordConfirm: ""});
            }
        });
    };

    render() {
        return (
            <>
                <Header/>
            <section className="container wrapper fadeInDown col-sm" id="formContent">
                <Heading as="h2" className="font-weight-light mb-3"><strong>
                    Atualizar senha
                </strong></Heading>
                <div className="alert alert-danger"
                     style={{display: this.state.error ? "" : "none"}}>{this.state.error}</div>
                <div className="alert alert-success"
                     style={{display: this.state.message ? "" : "none"}}>{this.state.message}</div>
                <br/>
                <form className="form-group">
                    <div className="form-row center">
                        <div className="col-md-8 mb-3">
                            <label for="email">Senha</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faKey}/>
                                    </span>
                                </div>
                                <input type="password" className="form-control"
                                       id="password"
                                       name="password"
                                       placeholder="*******"
                                       value={this.state.newPassword}
                                       aria-describedby="senha"
                                       onChange={e =>
                                           this.setState({
                                               newPassword: e.target.value,
                                               message: "",
                                               error: ""
                                           })
                                       }
                                       autoFocus
                                       required/>
                            </div>
                        </div>
                        <div className="col-md-8 mb-3">
                            <label for="email">Confirmar senha</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faKey}/>
                                    </span>
                                </div>
                                <input type="password" className="form-control"
                                       id="password"
                                       name="password"
                                       placeholder="*******"
                                       value={this.state.newPasswordConfirm}
                                       aria-describedby="senha"
                                       onChange={e =>
                                           this.setState({
                                               newPasswordConfirm: e.target.value,
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
                        onClick={this.resetPassword}
                        className="btn btn-success text-white">
                        Mudar senha
                    </button>
                </form>
                <div className="text-center">
                    Após redefinir a senha, <Link to="/login">entre aqui!</Link>
                </div>
            </section>
                </>
        );
    }
}