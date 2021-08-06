import React from 'react';
import {isAuthenticated} from "../auth";
import {Redirect, Link} from 'react-router-dom'
import {list} from "./apiPost";
import {Default} from "react-spinners-css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faDeaf, faFilter, faGlobe,
    faHome, faLaptop,
    faLaptopHouse, faMapMarker,
    faPlus,
    faSearch
} from "@fortawesome/free-solid-svg-icons";
import Header from "../core/Header";
import FormatPost from "./FormatPost";
import {NotFound} from "../img";
import {Button, Heading, MenuButton, MenuItem, MenuList, Text, Menu, Box} from "@chakra-ui/core";
import {getAllStates, getStateCities} from "easy-location-br";


export default class Posts extends React.Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            error: "",
            redirectToLogin: false,
            loading: true,
            page: 1,
            limit: 6,
            totalItems: 0,
            search: '',
            filter: 'all',
            order: 'date',
            cities: [],
            states: getAllStates(),
            city: "",
            state: ""
        }
    };

    handleChange = name => event => {
        if (name === 'state') {
            if (event.target.value === '')
                this.setState({city: ''});
            else this.setState({cities: getStateCities(event.target.value)});
        }
        const value = event.target.value;
        this.setState({error: '', [name]: value});
    };

    searchPosts = (event) => {
        event.preventDefault();
        this.loadPosts(this.state.page, this.state.search);
    };

    loadPosts = (page, search, filter = this.state.filter, order = this.state.order, city = this.state.city, state = this.state.state) => {
        this.setState({loading: true});
        list(isAuthenticated().token, page, this.state.limit, search, filter, order, city, state)
            .then(data => {
                if (data.error) {
                    this.setState({redirectToLogin: true, loading: false});
                } else {
                    this.setState({posts: data.posts, loading: false, totalItems: data.totalItems, filter});
                }
            })
            .catch(err => this.setState({error: err}));
    };

    componentDidMount() {
        this.loadPosts(this.state.page, this.state.search, this.state.filter, this.state.order);
        this.setState({states: getAllStates()});
    }

    changePage = (page) => {
        this.setState({page});
    };

    search() {
        return <form className="form-group text-center">
            <div className="col-md-12 form-row">
                <div className="col-md-7 mb-3 center">
                    <div className="input-group">
                        <input type="text" className="form-control" name="search"
                               onChange={this.handleChange("search")}
                               placeholder="Pesquisar evento" aria-describedby="name"/>
                        <div className="input-group-prepend">
                            <button
                                onClick={this.searchPosts}
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

    isActiveOrder = (value) => {
        return value === this.state.order;
    };

    orderPosts = (event) => {
        event.preventDefault();
        this.loadPosts(this.state.page, this.state.search, this.state.filter, event.target.value);
    };

    order() {
        return <div className="col-6">
            <Text fontSize="lg" className="center">
                <FontAwesomeIcon icon={faDeaf} className="mr-1"/>
                Acessibilidade
            </Text>
            <div className="row center mb-4">
                <button value="accessibility"
                        className={this.isActiveOrder('accessibility') ?
                            ' btn btn-danger mr-1 custom-button ' :
                            ' btn btn-outline-danger mr-1 custom-button '}
                        onClick={this.orderPosts}>Pouco acessível
                </button>
                <button value="accessibility"
                        className={this.isActiveOrder('accessibility') ?
                            ' btn btn-primary mr-1 custom-button ' :
                            ' btn btn-outline-primary mr-1 custom-button '}
                        onClick={this.orderPosts}>Acessível
                </button>
                <button value="accessibility"
                        className={this.isActiveOrder('accessibility') ?
                            ' btn btn-success mr-1 custom-button ' :
                            ' btn btn-outline-success mr-1 custom-button '}
                        onClick={this.orderPosts}>
                    Muito acessível
                </button>
            </div>
        </div>
    }

    isActiveFilter = (value) => {
        return value === this.state.filter;
    };

    filterPosts = (event) => {
        event.preventDefault();
        this.loadPosts(this.state.page, this.state.search, event.target.value, this.state.order);
    };

    filter() {
        return <div className="d-block center">
            <Menu>
                <MenuButton as={Button} rightIcon="chevron-down" textAlign='center' className='custom-button'>
                    <FontAwesomeIcon icon={faFilter} className="mr-1"/>
                    Filtro
                </MenuButton>
                <MenuList>
                    <MenuItem value="online"
                              className={this.isActiveFilter('online') ?
                                  ' mr-1 custom-button bg-success ' :
                                  ' mr-1 custom-button bg-outline-success '}
                              onClick={this.filterPosts}>
                        <FontAwesomeIcon icon={faLaptop} className="mr-1"/>Online
                    </MenuItem>
                    <MenuItem value="presencial"
                              className={this.isActiveFilter('presencial') ?
                                  ' mr-1 custom-button bg-primary ' :
                                  ' mr-1 custom-button bg-outline-primary '}
                              onClick={this.filterPosts}>
                        <FontAwesomeIcon icon={faHome} className="mr-1"/>Presencial
                    </MenuItem>
                    <MenuItem value="all"
                              className={this.isActiveFilter('all') ?
                                  ' btn btn-secondary mr-1 custom-button ' :
                                  ' btn btn-outline-secondary mr-1 custom-button '}
                              onClick={this.filterPosts}>
                        <FontAwesomeIcon icon={faLaptopHouse} className="mr-1"/>Todos
                    </MenuItem>
                </MenuList>
            </Menu>
        </div>
    }

    clickFilter = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const {state, city, page, search, filter, order} = this.state;
        this.loadPosts(page, search, filter, order, city, state);
    };

    filterLocale() {
        const {states} = this.state;
        return <Box as='form' className="form-group text-center" w="100%" p={4} color="white">
            <div className="form-row">
                <div className="col-md mb-3">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faGlobe}/>
                            </span>
                        </div>
                        <select id="state" name="state" className="form-control"
                                onChange={this.handleChange("state")}>
                            <option value=''>Selecione um estado</option>
                            {states.map(s => {
                                return <option value={s.id}>{s.name}</option>
                            })}
                        </select>
                    </div>
                </div>
                <div className="col-md mb-3">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faMapMarker}/>
                            </span>
                        </div>
                        <select id="city" name="city" className="form-control"
                                onChange={this.handleChange("city")}>
                            <option value=''>Selecione uma cidade</option>
                            {this.state.cities.map((c) => {
                                return <option value={c.name}> {c.name} </option>
                            })}
                        </select>
                    </div>
                </div>
                <Button onClick={this.clickFilter} type="submit" color='white'
                        className="btn bg-success">
                    <FontAwesomeIcon icon={faFilter} className="mr-1"/>
                    Filtrar
                </Button>
            </div>
        </Box>
    }

    render() {
        const {error, loading, posts} = this.state;
        const redirectLogin = this.state.redirectToLogin;
        if (redirectLogin) return <Redirect to="/login"/>;
        return (
            <>
                <Header/>
                <div className="container">
                    <Heading as="h1" className="font-weight-light wrapper border-bottom"><strong>Eventos</strong>
                    </Heading>
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{this.error}</div>
                    <br/>
                    {this.search()}
                    <div className="row center">
                        {this.filter()}
                        {this.filterLocale()}
                    </div>
                    <section className="row center">
                        {loading ? <Default/> :
                            posts.length ?
                                posts.map((post, i) => <FormatPost post={post} index={i}/>) :
                                <>
                                    <Heading as="h4" className="font-weight-light wrapper">Nenhum evento
                                        encontrado</Heading>
                                    <img src={NotFound} alt="Nenhum evento encontrado" width='20%'/>
                                </>
                        }

                    </section>
                </div>
            </>
        )
    }
}

         