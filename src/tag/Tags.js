import React from 'react';
import {isAuthenticated} from "../auth";
import {Redirect} from 'react-router-dom'
import {Default} from "react-spinners-css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import Header from "../core/Header";
import {NotFound} from "../img";
import {Image, Heading} from "@chakra-ui/core";
import {getTags} from './apiTag'
import FormatTag from "./FormatTag";

export default class Tags extends React.Component {
    constructor() {
        super();
        this.state = {
            tags: [],
            error: "",
            redirectToLogin: false,
            loading: false,
            page: 1,
            limit: 6,
            totalItems: 0,
            search: '',
        }
    };

    allTags = (search = '') => {
        const token = isAuthenticated().token;
        this.setState({loading: true});
        getTags(token, search).then(data => {
            if (data.error) {
                this.setState({redirectToLogin: true});
            } else {
                this.setState({tags: data, loading: false});
            }
        }).catch(err => this.setState({error: err}));
    }

    searchTags = (event) => {
        event.preventDefault();
        this.allTags(this.state.search);
    };

    componentDidMount() {
        this.allTags();
    }

    handleChange = name => event => {
        this.setState({error: ""});
        this.setState({[name]: event.target.value});
    };

    search() {
        return <form className="form-group text-center">
            <div className="col-md-12 form-row">
                <div className="col-md-7 mb-3 center">
                    <div className="input-group">
                        <input type="text" className="form-control" name="search"
                               onChange={this.handleChange("search")}
                               placeholder="Pesquisar categoria" aria-describedby="name"/>
                        <div className="input-group-prepend">
                            <button
                                onClick={this.searchTags}
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
        const {error, loading, tags} = this.state;
        const redirectLogin = this.state.redirectToLogin;
        if (redirectLogin) return <Redirect to="/login"/>;
        return (
            <>
                <Header/>
                <div className="container">
                    <Heading as="h1" className="font-weight-light wrapper border-bottom">
                        <strong>Categorias</strong>
                    </Heading>
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{this.error}</div>
                    <br/>
                    {this.search()}
                    <section className="row center">
                        {loading ? <Default/> :
                            tags.length ?
                                tags.map((tag) => <FormatTag tag={tag}/>) :
                            <>
                                <Heading as="h4" className="font-weight-light wrapper">
                                    Nenhuma categoria encontrada
                                </Heading>
                                <Image src={NotFound} alt="Nenhuma categoria encontrada" width='20%'/>
                            </>
                        }
                    </section>
                </div>
            </>
        )
    }
}