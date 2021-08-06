import React, {Component} from 'react';
import {isAuthenticated} from "../auth";
import {Link, Redirect} from 'react-router-dom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import Header from "../core/Header";
import {Button, Heading} from "@chakra-ui/core";
import {Default} from "react-spinners-css";
import {NotFound} from "../img";
import {Table, Tbody, Th, Thead, Tr} from "@chakra-ui/react";

class Admins extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            error: "",
            redirectToLogin: false,
            page: 1,
            limit: 12,
            totalItems: 0,
            search: '',
            loading: false,
            order: 'name',
            message: ''
        }
    };

    handleChange = name => event => {
        const value = event.target.value;
        this.setState({error: '', [name]: value});
    };

    list = (token, search) => {
        return fetch(`${process.env.REACT_APP_API}/users/admin/?&search=${search}`, {
            method: "GET",
            headers: {
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

    sendRes = (userId, token) => {
        return fetch(`${process.env.REACT_APP_API}/user/acceptReq/${userId}`, {
            method: "PUT",
            headers: {
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Content-Length": "139",
                "Sec-Fetch-Dest": "empty",
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_API}`,
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            return response.json();
        }).catch(err => console.log(err));
    };

    loadUsers = (search = '') => {
        this.setState({loading: true});
        this.list(isAuthenticated().token, search)
            .then(data => {
                if (data.error) {
                    this.setState({redirectToLogin: true, loading: false});
                } else {
                    this.setState({users: data.users, loading: false});
                }
            })
            .catch(err => this.setState({error: err}));
    };

    componentDidMount() {
        this.loadUsers();
    };

    searchUser = (event) => {
        event.preventDefault();
        this.loadUsers(this.state.search);
    };

    acceptReq = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const userId = event.target.value;
        this.sendRes(userId, isAuthenticated().token)
            .then(data => {
                if (data.error) {
                    this.setState({redirectToLogin: true, loading: false});
                } else {
                    window.location.reload();
                    this.setState({loading: false, message: 'Solicitação aceita'});
                }
            })
            .catch(err => this.setState({error: err}));
    };

    search() {
        return <form className="form-group text-center">
            <div className="col-md-12 form-row">
                <div className="col-md-7 mb-3 center">
                    <div className="input-group">
                        <input type="text" className="form-control" name="search"
                               onChange={this.handleChange("search")}
                               placeholder="Pesquisar usuário" aria-describedby="name"/>
                        <div className="input-group-prepend">
                            <button
                                onClick={this.searchUser}
                                className="btn bts-sm btn-success input-group-text bg-success rounded-right text-white"
                                type="submit">
                                <FontAwesomeIcon icon={faSearch} className="mr-1"/>Pesquisar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    }

    render() {
        const {error, users, loading, message} = this.state;
        const redirectLogin = this.state.redirectToLogin;
        if (redirectLogin) return <Redirect to="/login"/>;
        return (
            <>
                <Header/>
                <div className="container">
                    <Heading as="h1" className="font-weight-light wrapper border-bottom">
                        <strong>Administradores</strong>
                    </Heading>
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{error}</div>
                    <div className="alert alert-success" style={{display: message ? "" : "none"}}>{message}</div>
                    {this.search()}
                    <div className="row center">
                        {
                            loading ? <Default/> :
                                users.length ? (
                                        <Table className="table table-responsive-lg">
                                            <Thead>
                                            <Tr>
                                                <Th scope="col">Nome</Th>
                                                <Th scope="col">Email</Th>
                                                <Th scope="col">Opções</Th>
                                            </Tr>
                                            </Thead>
                                            <Tbody>
                                            {users.map((user) => {
                                                return (<tr>
                                                    <td>
                                                        <Link to={`/user/${user._id}`}>
                                                            {user.name}
                                                        </Link>
                                                    </td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <Button value={user._id} onClick={this.acceptReq}>
                                                            Aceitar solicitação
                                                        </Button>
                                                    </td>
                                                </tr>)
                                            })}
                                            </Tbody>
                                        </Table>) :
                                    <>
                                        <h4 className="font-weight-light wrapper">Nenhuma solicitação encontrada</h4>
                                        <img src={NotFound} alt="Nenhuma solicitação encontrada" width='20%'/>
                                    </>
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default Admins;