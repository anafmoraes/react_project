import React from 'react';
import {isAuthenticated} from "../auth";
import { Redirect} from 'react-router-dom'
import {Default} from 'react-spinners-css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowUp,
    faCalendarAlt, faHeart,
    faSearch, faSortAlphaDown
} from "@fortawesome/free-solid-svg-icons";
import {NotFound} from '../img';
import Header from "../core/Header";
import Pagination from "../core/Pagination";
import FormatUser from "./FormatUser";
import {Button, Heading, MenuButton, MenuItem, MenuList, Menu} from "@chakra-ui/core";

export default class Users extends React.Component {
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
            order: 'name'
        }
    };

    isActive = (value) => {
        return value === this.state.order;
    };

    handleChange = name => event => {
        const value = event.target.value;
        this.setState({error: '', [name]: value});
    };

    list = (token, page, limit, search, order) => {
        return fetch(`${process.env.REACT_APP_API}/users/?page=${page}&limit=${limit}&search=${search}&order=${order}`, {
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

    loadUsers = (page, search, order = this.state.order) => {
        this.setState({loading: true});
        this.list(isAuthenticated().token, page, this.state.limit, search, order)
            .then(data => {
                if (data.error) {
                    this.setState({redirectToLogin: true, loading: false});
                } else {
                    this.setState({users: data.users, loading: false, totalItems: data.totalItems, order});
                }
            })
            .catch(err => this.setState({error: err}));
    };

    componentDidMount() {
        this.loadUsers(this.state.page, '', this.state.order);
    };

    searchUser = (event) => {
        event.preventDefault();
        this.loadUsers(this.state.page, this.state.search);
    };

    orderUser = (event) => {
        event.preventDefault();
        const order = event.target.value;
        this.loadUsers(this.state.page, this.state.search, order);
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

    order() {
        return <div className="row center mb-4">
            <Menu>
                <MenuButton as={Button} rightIcon="chevron-down" textAlign='center' className='custom-button'>
                    <FontAwesomeIcon icon={faArrowUp} className="mr-1"/>
                    Ordenação
                </MenuButton>
                <MenuList>
                    <MenuItem value="followers"
                              className={this.isActive('followers') ?
                                  ' mr-1 custom-button bg-danger' :
                                  ' mr-1 custom-button bg-outline-danger '}
                              onClick={this.orderUser}>
                        <FontAwesomeIcon icon={faHeart} className="mr-1"/>
                        Curtidas
                    </MenuItem>
                    <MenuItem value="posts"
                            className={this.isActive('posts') ?
                                ' bg-primary mr-1 custom-button ' :
                                ' bg-outline-primary mr-1 custom-button '}
                            onClick={this.orderUser}>
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1"/>Eventos
                    </MenuItem>
                    <MenuItem value="name"
                            className={this.isActive('name') ?
                                ' bg-secondary mr-1 custom-button ' :
                                ' bg-outline-secondary mr-1 custom-button '}
                            onClick={this.orderUser}>
                        <FontAwesomeIcon icon={faSortAlphaDown} className="mr-1"/>Alfabética
                    </MenuItem>
                </MenuList>
            </Menu>
            </div>
    }

    changePage = (page) => {
        this.setState({page});
    };

    render() {
        const {error, users, page, totalItems, limit, loading} = this.state;
        const redirectLogin = this.state.redirectToLogin;
        if (redirectLogin) return <Redirect to="/login"/>;
        return (
            <>
                <Header/>
                <div className="container">
                    <Heading as="h1" className="font-weight-light wrapper border-bottom"><strong>Usuários</strong>
                    </Heading>
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{error}</div>
                    {this.search()}
                    {this.order()}
                    <div className="row center">
                        {
                            loading ? <Default/> :
                                users.length ? users.map((user, i) => <FormatUser user={user} index={i}/>) :
                                    <>
                                        <h4 className="font-weight-light wrapper">Nenhum usuário encontrado</h4>
                                        <img src={NotFound} alt="Nenhum usuário encontrado" width='20%'/>
                                    </>
                        }
                    </div>
                    <Pagination
                        page={page}
                        limit={limit}
                        objs={users}
                        totalItems={totalItems}
                        load={this.loadUsers}
                        changePage={this.changePage}/>
                </div>
            </>
        )
    }
}